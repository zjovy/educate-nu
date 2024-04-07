import Assignment from './Assignment';
import PropTypes from 'prop-types';

const Assignments = ({ assignments }) => {
  return (
    <div>
      {assignments.map((assignment) => (
        <Assignment key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
};

Assignments.propTypes = {
    assignments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string,
    })).isRequired,
};

export default Assignments;