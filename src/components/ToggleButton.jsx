import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';

const ToggleButton = ({ onClick, isVisible }) => {
  return (
    <Transition
      show={isVisible}
      enter="transition transform duration-300 ease-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition transform duration-300 ease-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      {(ref) => (
        <button
          ref={ref}
          className="absolute top-4 right-4 z-10 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600"
          onClick={onClick}
        >
          {isVisible ? 'Hide Videos' : 'Show Videos'}
        </button>
      )}
    </Transition>
  );
};

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default ToggleButton;
