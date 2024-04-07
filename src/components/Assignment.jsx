import { useState } from 'react';
import PropTypes from 'prop-types';
import AssignmentDetails from './AssignmentDetails';

const Assignment = ({ assignment }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const showDetails = () => {
        setIsDetailsVisible(true);
    };

    const hideDetails = () => {
        setIsDetailsVisible(false);
    };

    const handleFileUpload = (event) => {
        // You would handle the file upload logic here
        console.log(event.target.files);
    };

    return (
      <>
        <div className="bg-white p-4 shadow rounded mb-4 cursor-pointer hover:bg-gray-200 transform hover:-translate-y-1 transition duration-300 ease-in-out" onClick={showDetails}>
          <h3 className="font-bold text-lg">{assignment.title}</h3>
          <p>Due date: {assignment.dueDate}</p>
          {/* Render more assignment details here */}
        </div>

        {isDetailsVisible && (
          <AssignmentDetails 
            isVisible={isDetailsVisible}
            onClose={hideDetails}
            assignment={assignment}
            onFileUpload={handleFileUpload}
          />
        )}
      </>
    );
};

Assignment.propTypes = {
    assignment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
    }).isRequired,
};

export default Assignment;
