import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Assignments from './Assignments';
import Assign from './Assign';
import { fetchData } from '../apiService';

const Class = ({ classData, teacherView }) => {

  const [assigning, setAssigning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentsForClass = async () => {
        try {
            // First, fetch enrollments for this class
            const enrollmentData = await fetchData("enrollments");
            const enrollmentsForClass = enrollmentData.records.filter(enrollment => 
                parseInt(enrollment.course.value) === classData.id);

            // Extract student IDs from enrollments
            const studentIds = enrollmentsForClass.map(enrollment => parseInt(enrollment.student_id.value));

            // Fetch all people
            const peopleData = await fetchData("people");
            const students = peopleData.records.filter(person => 
                studentIds.includes(parseInt(person.id.value)));

            // Now 'students' contains details for students enrolled in this class
            setStudents(students);
        } catch (error) {
            console.error("There was a problem fetching enrollment or student data:", error);
            // Handle or display the error as needed
        }
    };
    fetchStudentsForClass();
  }, [classData.id]); // Rerun if classData.id changes

  console.log(students)


  const handleAddAssignment = () => {
    setAssigning(true);
  };

  return (
    <div className="bg-[#3D3C53] p-6 rounded shadow-lg mb-6 relative">
      {assigning && <div className="modal-backdrop"></div>}
      {showDetails && <div className="modal-backdrop"></div>}
      <h2 className="font-bold text-xl mb-4 text-[#E8E9F3]">{classData.name}</h2>
      {teacherView && (
        <button
          onClick={handleAddAssignment}
          className="absolute top-0 right-0 mt-2 mr-5 text-[#E8E9F3] hover:text-[#B1E5F2]"
          aria-label="Add assignment"
          style={{ fontSize: '36px' }}
        >
          +
        </button>
      )}
      <Assignments assignments={classData.assignments} setShowDetails={setShowDetails} teacherView={teacherView} students={students}/>
      {assigning && (
        <Assign
          showAssignModal={assigning}
          setShowAssignModal={setAssigning}
          classId={classData.id}
        />
      )}
    </div>
  );
};

Class.propTypes = {
  classData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    assignments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
    })).isRequired,
  }).isRequired,
  teacherView: PropTypes.bool,
};

export default Class;
