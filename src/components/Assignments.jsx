import Assignment from './Assignment';
import PropTypes from 'prop-types';

const Assignments = ({ assignments, setShowDetails }) => {
  return (
    <div>
      {assignments.map((assignment) => (
        <Assignment key={assignment.id} assignment={assignment} setDetailsOn={setShowDetails} />
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
    setShowDetails: PropTypes.func,
};

export default Assignments;