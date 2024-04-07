import { useState } from 'react';
import PropTypes from 'prop-types';
import AssignmentDetails from './AssignmentDetails';

const Assignment = ({ assignment, setDetailsOn, teacherView, students }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    const showDetails = () => {
        setIsDetailsVisible(true);
        setDetailsOn(true);
    };

    const hideDetails = () => {
        setIsDetailsVisible(false);
        setDetailsOn(false);
    };

    const handleFileUpload = (event) => {
        // You would handle the file upload logic here
        console.log(event.target.files);
    };

    return (
      <>
        <div className="bg-[#E8E9F3] p-4 shadow rounded mb-4 cursor-pointer hover:bg-gray-200 transform hover:-translate-y-1 transition duration-300 ease-in-out" onClick={showDetails}>
          <h3 className="font-bold text-lg">{assignment.title}</h3>
          <p>Due date: {assignment.dueDate}</p>
        </div>
        {isDetailsVisible && (
          <AssignmentDetails 
            isVisible={isDetailsVisible}
            onClose={hideDetails}
            assignment={assignment}
            onFileUpload={handleFileUpload}
            teacherView={teacherView}
            students={students}
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
    setDetailsOn: PropTypes.func,
    teacherView: PropTypes.bool,
    students: PropTypes.array,
};

export default Assignment;
