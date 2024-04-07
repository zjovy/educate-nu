import Assignment from './Assignment';
import PropTypes from 'prop-types';

const Assignments = ({ assignments, setShowDetails, teacherView, students }) => {
  return (
    <div>
      {assignments.map((assignment) => (
        <Assignment key={assignment.id} assignment={assignment} setDetailsOn={setShowDetails} teacherView={teacherView} students={students} />
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
    teacherView: PropTypes.bool,
    students: PropTypes.array,
};

export default Assignments;