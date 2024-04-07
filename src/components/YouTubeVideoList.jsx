import React from 'react';
import { Transition } from '@headlessui/react';

const ToggleButton = ({ onClick, isVisible }) => {
  return (
    <button className="absolute top-4 right-4 z-10 bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600" onClick={onClick}>
      {isVisible ? 'Hide Videos' : 'Show Videos'}
    </button>
  );
};

const YouTubeVideo = ({ video }) => {
  // Extract title and URL from the video data
  const [title, url] = video;

  // Function to extract video ID from YouTube URL
  const getVideoId = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return videoIdMatch && videoIdMatch[1];
  };

  const videoId = getVideoId(url);

  // Construct thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  // Construct video URL
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

const YouTubeVideoList = ({ urls }) => {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      {urls.map((video, index) => (
        <YouTubeVideo key={index} video={video} />
      ))}
    </div>
  );
};

const YouTubeColumn = ({ isVisible, videos, toggleColumnVisibility }) => {
  return (
    <Transition
      show={isVisible}
      enter="transform transition duration-300 ease-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transform transition duration-300 ease-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      {(ref) => (
        <div ref={ref} className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 z-50">
          {/* <ToggleButton onClick={toggleColumnVisibility} isVisible={isVisible} /> */}
          <YouTubeVideoList urls={videos} />
        </div>
      )}
    </Transition>
  );
};

export default YouTubeColumn;
