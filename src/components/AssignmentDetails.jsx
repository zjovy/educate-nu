import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { fetchData } from '../apiService';
import LoadingSpinner from './LoadingSpinner';
import Feedback from './Feedback';


const AssignmentDetails = ({ isVisible, onClose, assignment, onFileUpload, teacherView, students }) => {

    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGraded, setIsGraded] = useState(false)
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (teacherView) {
                try {
                    const data = await fetchData("submissions");
                    const filteredSubmissions = data.records.filter(sub => parseInt(sub.assignment_id.value) === assignment.id);
                    const submissionsWithStudentName = filteredSubmissions.map(submission => {
                        const student = students.find(student => parseInt(student.id.value) === parseInt(submission.student_id.value));
                        return { ...submission, studentName: student ? `${student.first.value} ${student.last.value}` : "Unknown Student" };
                    });
                    setSubmissions(submissionsWithStudentName);
                } catch (error) {
                    console.error("There was a problem fetching submission data:", error);
                }
            }
        };
        fetchSubmissions();
    }, [assignment.id, teacherView, students]);

    const handleGradeSubmission = async () => {
        setIsLoading(true);

        try {
            // Example data structure - adjust according to your needs
            const payload = {
                ASSIGNMENT_NAME: assignment.title,
                // Add more fields as needed, for example, files:
                // files: [submission.file] // assuming `submission` has a file property
            };
    
            const response = await fetch('http://127.0.0.1:8000/grade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // If using FormData, remove 'Content-Type' header so browser sets it with boundary
                },
                body: JSON.stringify(payload), // If using FormData, pass it directly without JSON.stringify
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Grade submission success:', data);
    
            // Handle success - e.g., display a message, update state, etc.
            setData(data);
            setIsGraded(true);
            onClose();
        } catch (error) {
            console.error('Failed to grade submission:', error);
            // Handle error - e.g., display error message
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isVisible) return null;

    return (
        <>
            {!teacherView && !isGraded && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                    <div className="bg-[#E8E9F3] rounded-lg shadow-xl p-6 m-4 max-w-sm max-h-full overflow-y-auto">
                        <button onClick={onClose} className="float-right text-gray-700 hover:text-gray-900">&times;</button>
                        <h2 className="text-xl font-bold mb-2">{assignment.title}</h2>
                        <p className="mb-4">{assignment.description}</p>
                        <p className="mb-4"><strong>Due date: </strong>{assignment.dueDate}</p>
                        <p className="mb-4">Upload your assignment:</p>
                        <input type="file" onChange={onFileUpload} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B1E5F2] file:text-[#272635] hover:file:bg-[#96DDED]" />
                    </div>
                </div>
            )}
            {!teacherView && isGraded && (
                // Content to show when the assignment is graded
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                <div className="bg-[#E8E9F3] rounded-lg shadow-xl p-6 m-4 max-w-sm max-h-full overflow-y-auto">
                    <button onClick={onClose} className="float-right text-gray-700 hover:text-gray-900">&times;</button>
                    <Feedback data={data} />
                </div>
            </div>
            )}
            {teacherView && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="relative bg-[#E8E9F3] rounded-lg shadow-xl p-8 m-4 w-96 h-auto overflow-y-auto" style={{ maxHeight: '90%' }}>
                        <button onClick={onClose} className="absolute top-0 right-0 m-4 text-gray-700 hover:text-gray-900">
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">{assignment.title} Submissions</h2>
                        {!isLoading && submissions.map((sub, index) => (
                            <div key={index} className="mb-4 flex justify-between items-center">
                                <span>{sub.studentName}</span>
                                <button 
                                    className="bg-[#B1E5F2] text-[#272635] hover:bg-[#96DDED] font-bold py-2 px-4 rounded" 
                                    onClick={() => handleGradeSubmission(sub)}>
                                    Grade
                                </button>
                            </div>
                        ))}
                        {isLoading &&  <LoadingSpinner />}
                    </div>
                </div>
            )}
        </>
    );
};

AssignmentDetails.propTypes = {
    assignment: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
    }).isRequired,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFileUpload: PropTypes.func.isRequired,
    teacherView: PropTypes.bool,
    students: PropTypes.array,
};

export default AssignmentDetails;