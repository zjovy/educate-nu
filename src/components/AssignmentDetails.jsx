import PropTypes from 'prop-types';

const AssignmentDetails = ({ isVisible, onClose, assignment, onFileUpload }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm max-h-full overflow-y-auto">
                <button onClick={onClose} className="float-right text-gray-700 hover:text-gray-900">&times;</button>
                <h2 className="text-xl font-bold mb-2">{assignment.title}</h2>
                <p className="mb-4">{assignment.description}</p>
                <p className="mb-4"><strong>Due date: </strong>{assignment.dueDate}</p>
                <p className="mb-4">Upload your assignment:</p>
                <input type="file" onChange={onFileUpload} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
            </div>
        </div>
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
};

export default AssignmentDetails;