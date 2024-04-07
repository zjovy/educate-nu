import { useState } from 'react';
import PropTypes from 'prop-types';

import Assignments from './Assignments';
import Assign from './Assign';
const Class = ({ classData, teacherView }) => {

  const [assigning, setAssigning] = useState(false);

  const handleAddAssignment = () => {
    // Logic to open Assign component for this specific class
    // This could be a modal, a new page, or an in-line form
    // For now, we'll simply log the action
    setAssigning(true);
  };

  return (
    <div className="bg-[#272635] p-6 rounded shadow-lg mb-6 relative">
      {assigning && <div className="modal-backdrop"></div>}
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
      <Assignments assignments={classData.assignments} />
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
