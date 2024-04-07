import { useState } from 'react';
import PropTypes from 'prop-types';

const Login = (props) => {
    const [userType, setUserType] = useState("");

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setUserType(userType);
        props.setLoggedIn(true);
        props.setShowLogin(false);
    };

    const handleClose = () => {
        props.setShowLogin(false);
    };

    return (
        // Create an overlay for the popup
        <div className="fixed inset-0 flex items-center justify-center min-h-screen">
            {/* Center the card on the overlay */}
            <div className="relative p-8 bg-[#E8E9F3] rounded shadow-lg w-full max-w-md m-4">
                <button 
                    onClick={handleClose}
                    className="absolute top-0 right-0 m-2 text-[#CECECE] hover:text-[#A6A6A8] transition-colors"
                >
                    <span className="text-xl">&times;</span>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-[#272635]">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-5">
                        <span className="text-[#272635] text-lg mb-3 block">Are you a student or a teacher?</span>
                        <select
                            className="text-lg form-select block w-full mt-1 border-gray-300 rounded shadow-sm focus:border-[#B1E5F2] focus:ring focus:ring-[#B1E5F2] focus:ring-opacity-50"
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
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-300 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-[#E8E9F3] focus:ring-opacity-50 shadow-lg transition ease-in-out duration-300 transform hover:-translate-y-1"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

Login.propTypes = {
    setUserType: PropTypes.func.isRequired,
    setShowLogin: PropTypes.func.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
};

export default Login;
