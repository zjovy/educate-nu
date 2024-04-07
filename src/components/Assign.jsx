import { useState } from 'react';
import PropTypes from 'prop-types';


const Assign = ({ showAssignModal, setShowAssignModal, classId }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [problemFile, setProblemFile] = useState(null);
    const [solutionFile, setSolutionFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Assuming your backend expects the course_id to be sent as a separate field
        const formData = new FormData();
        formData.append('course_id', classId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('due', dueDate); // Assuming 'due' is the expected field name for due date
        if (problemFile) formData.append('problems', problemFile); // Assuming 'problems' is the expected field name
        if (solutionFile) formData.append('solutions', solutionFile); // Assuming 'solutions' is the expected field name

        // Make sure to replace '/api/assignments/create' with your actual API endpoint
        const response = await fetch('/api/assignments/create', {
            method: 'POST',
            body: formData,
            // Omit the Content-Type header, as the browser will set it (with the correct boundary) when you pass FormData
        });

        if (response.ok) {
            // Handle success (e.g., display a success message, clear the form, etc.)
            console.log('Assignment created successfully');
            setShowAssignModal(false); // Close the modal
        } else {
            // Handle error (e.g., display an error message)
            console.error('Failed to create assignment');
        }
    };

    const handleClose = () => setShowAssignModal(false);

    if (!showAssignModal) return null;

    return (
        <div className="bg-gray-600 bg-opacity-50 fixed inset-0 z-50 overflow-auto bg-smoke-light flex ">
            <div className="relative p-8 bg-[#E8E9F3] w-full max-w-md m-auto flex-col flex rounded-lg">
                <span className="absolute top-0 right-0 p-4">
                    <button onClick={handleClose}>×</button>
                </span>
                <h2 className="text-2xl text-[#272635] font-bold mb-4">New Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-gray-700">Due Date</label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    {/* File input for Problem Set PDF */}
                    <div className="mb-4">
                        <label htmlFor="problemFile" className="block text-gray-700">Problem Set (PDF)</label>
                        <input
                            id="problemFile"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setProblemFile(e.target.files[0])}
                            className="w-full px-3 py-2 border rounded block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B1E5F2] file:text-[#272635] hover:file:bg-[#96DDED]"
                        />
                    </div>
                    {/* File input for Solution Set PDF */}
                    <div className="mb-4">
                        <label htmlFor="solutionFile" className="block text-gray-700">Solution Set (PDF)</label>
                        <input
                            id="solutionFile"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setSolutionFile(e.target.files[0])}
                            className="w-full px-3 py-2 border rounded block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#B1E5F2] file:text-[#272635] hover:file:bg-[#96DDED]"
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="bg-[#B1E5F2] text-[#272635] hover:bg-[#96DDED] font-bold py-2 px-4 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

Assign.propTypes = {
    showAssignModal: PropTypes.bool.isRequired,
    setShowAssignModal: PropTypes.func.isRequired,
    classId: PropTypes.number.isRequired, // Assuming classId is used for API call
};

export default Assign;
