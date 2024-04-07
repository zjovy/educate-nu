import Assignments from './Assignments';
import PropTypes from 'prop-types';

const Class = ({ classData }) => {
  return (
    <div className="bg-[#272635] p-6 rounded shadow-lg mb-6">
      <h2 className="font-bold text-xl mb-4 text-[#E8E9F3]">{classData.name}</h2>
      {/* Include other class details here */}
      <Assignments assignments={classData.assignments} />
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
};

export default Class;