import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Feedback = ({ data }) => {
    const [reviewAreas, setReviewAreas] = useState([]);

    useEffect(() => {
        // Parse the review_areas from JSON strings to objects
        setReviewAreas(data.review_areas);
    }, [data.review_areas]);

    console.log(data);

    return (
        <div className="grading-feedback">
            <div className="score">
                <h2>Score: {data.score}</h2>
            </div>
            <div className="feedback">
                <h3>Feedback</h3>
                {data.feedback.map((feedback, index) => (
                    <p key={index}>{feedback}</p>
                ))}
            </div>
            <div className="review-areas">
                <h3>Review Areas</h3>
                {reviewAreas.map((reviewArea, index) => (
                    <div key={index} className="review-area">
                        <h4>{reviewArea.prompt}</h4>
                        {reviewArea.videos.map((video, videoIndex) => (
                            <div key={videoIndex} className="video">
                                <a href={video[1]} target="_blank" rel="noopener noreferrer">{video[0]}</a>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

Feedback.propTypes = {
    data: PropTypes.shape({
        score: PropTypes.string.isRequired,
        feedback: PropTypes.arrayOf(PropTypes.string).isRequired,
        review_areas: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default Feedback;
