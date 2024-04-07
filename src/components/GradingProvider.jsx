import { createContext, useContext, useState } from 'react';

import PropTypes from 'prop-types';

const GradingContext = createContext();

export const useGrading = () => useContext(GradingContext);

export const GradingProvider = ({ children }) => {
    const [isGraded, setIsGraded] = useState(false);
    const [data, setData] = useState(null);

    const gradeAssignment = (newData) => {
        setData(newData);
        setIsGraded(true);
    };

    return (
        <GradingContext.Provider value={{ isGraded, data, gradeAssignment }}>
            {children}
        </GradingContext.Provider>
    );
};

GradingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};