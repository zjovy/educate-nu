import React, { useState, useEffect, useRef } from 'react';
import YouTubeColumn from './YouTubeVideoList';
import { Transition } from '@headlessui/react';

const URLout = () => {
  const [isColumnVisible, setIsColumnVisible] = useState(false);
  const columnRef = useRef(null);

  const toggleColumnVisibility = () => {
    setIsColumnVisible(!isColumnVisible);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (columnRef.current && !columnRef.current.contains(event.target)) {
        setIsColumnVisible(false);
      }
    }

    if (isColumnVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColumnVisible]);

  const youtubeUrls = [
    [
      "Math Basics: Addition",
      "https://www.youtube.com/watch?v=m97iiC7twDg"
    ],
    [
      "Math - Addition | Basic Introduction",
      "https://www.youtube.com/watch?v=BZ4FjSXjzgg"
    ],
    [
      "Matrix addition and subtraction | Matrices | Precalculus | Khan Academy",
      "https://www.youtube.com/watch?v=WR9qCSXJlyY"
    ]
  ];

  return (
    <div className="relative">
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 z-10 transition-transform"
        onClick={toggleColumnVisibility}
        style={{ transitionDuration: '0.3s', transitionTimingFunction: 'ease-out' }}
      >
        Show Videos
      </button>
      <Transition
        show={isColumnVisible}
        enter="transition-transform transform duration-300 ease-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform transform duration-300 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        {(ref) => (
          <div ref={columnRef} className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 z-50`}>
            <YouTubeColumn isVisible={isColumnVisible} videos={youtubeUrls} />
          </div>
        )}
      </Transition>
    </div>
  );
};

export default URLout;
