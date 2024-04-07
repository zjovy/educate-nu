import { useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const ToggleButton = ({ onClick, isVisible }) => {
  return (
    <button className="absolute top-4 right-4 z-10 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600" onClick={onClick}>
      {isVisible ? 'Hide Videos' : 'Show Videos'}
    </button>
  );
};

// PropTypes for ToggleButton
ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

const YouTubeVideo = ({ video }) => {
  const [title, url] = video;
  const getVideoId = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return videoIdMatch && videoIdMatch[1];
  };

  const videoId = getVideoId(url);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  const videoUrl = url;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <a href={videoUrl} target="_blank" rel="noopener noreferrer">
        <img src={thumbnailUrl} alt={title} className="rounded-lg mb-2" />
      </a>
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
};

// PropTypes for YouTubeVideo
YouTubeVideo.propTypes = {
  video: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const YouTubeVideoList = ({ videos }) => {
  return (
    <div>
      {videos.map((video, index) => (
        <YouTubeVideo key={index} video={video} />
      ))}
    </div>
  );
};

// PropTypes for YouTubeVideoList
YouTubeVideoList.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

const YouTubeColumn = ({ isVisible, prompts, toggleColumnVisibility }) => {
  return (
    <Transition
      show={isVisible}
      enter="transform transition duration-300 ease-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform transform duration-300 ease-in"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      {(ref) => (
        <div ref={ref} className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 z-50 overflow-y-auto">
          {prompts.map((prompt, index) => (
            <div key={index}>
              <h2 className="text-lg font-bold mb-4">{prompt.prompt}</h2>
              <YouTubeVideoList videos={prompt.videos} />
            </div>
          ))}
        </div>
      )}
    </Transition>
  );
};

// PropTypes for YouTubeColumn
YouTubeColumn.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  prompts: PropTypes.arrayOf(PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    videos: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  })).isRequired,
  toggleColumnVisibility: PropTypes.func.isRequired,
};
  

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
  
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setIsColumnVisible(false);
      }
    }
  
    if (isColumnVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isColumnVisible]);
  

  const youtubeUrls = [
    {
      prompt: "Tutorials on addition",
      videos: [
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
      ]
    },
    {
      prompt: "Tutorials on subtraction",
      videos: [
        [
          "Subtraction Basics",
          "https://www.youtube.com/watch?v=xJ-yX8H8t8g"
        ],
        [
          "Subtraction - Basic Introduction",
          "https://www.youtube.com/watch?v=lO5xerjrBjQ"
        ],
        [
          "Subtraction with regrouping",
          "https://www.youtube.com/watch?v=htnEze6uqQ4"
        ]
      ]
    }
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
      <YouTubeColumn isVisible={isColumnVisible} prompts={youtubeUrls} toggleColumnVisibility={toggleColumnVisibility} />
    </div>
  );
};

URLout.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  setShowLogin: PropTypes.func.isRequired,
  setUserType: PropTypes.func.isRequired,
  setUserID: PropTypes.func.isRequired,
  setUserName: PropTypes.func.isRequired,
};

export default URLout;
