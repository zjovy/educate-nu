import { useState } from 'react';
import PropTypes from 'prop-types';

const Login = (props) => {

    const [userType, setUserType] = useState("")

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setUserType(userType);
        props.setShowLogin(false);
    };

    const handleClose = () => {
        // Logic to hide the login form or navigate away
        props.setShowLogin(false);
    };

    return (
        // Create an overlay for the popup
        <div className="fixed inset-0">
            {/* Center the card on the overlay */}
            <div className="flex items-center justify-center min-h-screen">
                <div className="relative p-8 bg-white rounded shadow-lg w-full max-w-md m-4">
                    <button 
                        onClick={handleClose}
                        className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <span className="text-xl">&times;</span>
                    </button>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-5">
                            <span className="text-gray-700">Are you a student or a teacher?</span>
                            <select
                                className="form-select block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={userType}
                                onChange={handleUserTypeChange}
                            >
                                <option value="">Select</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </label>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    userType: PropTypes.string,
    setUserType: PropTypes.func.isRequired,
    setShowLogin: PropTypes.func.isRequired,
};

export default Login;
