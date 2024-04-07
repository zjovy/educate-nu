import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { fetchData } from '../apiService';

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchData("people");
                setUserData(data.records || []);
            } catch (error) {
                console.error("There was a problem fetching user data:", error);
                // Handle or display the error as needed
            }
        };
        getUserData();
    }, []);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Search for the user data by email
        const userRecord = userData.find((record) => record.email.value.toLowerCase() === email.toLowerCase());

        if (userRecord) {
            // If user found, set the user type and user ID
            const userType = userRecord.type.value;
            const userID = userRecord.id.value;
            const userName = userRecord.first.value + " " + userRecord.last.value;
            props.setUserType(userType.toLowerCase());
            props.setUserID(userID);
            props.setUserName(userName)
            props.setLoggedIn(true);
            props.setShowLogin(false);
        } else {
            // If user not found, handle accordingly (e.g., show an error message)
            alert('User not found. Please check your email or sign up.');
        }
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
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-[#272635] text-lg mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="text-lg p-2 w-full border-gray-300 rounded shadow-sm focus:border-[#B1E5F2] focus:ring focus:ring-[#B1E5F2] focus:ring-opacity-50"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-[#272635] text-lg mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="text-lg p-2 w-full border-gray-300 rounded shadow-sm focus:border-[#B1E5F2] focus:ring focus:ring-[#B1E5F2] focus:ring-opacity-50"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
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
    setLoggedIn: PropTypes.func.isRequired,
    setShowLogin: PropTypes.func.isRequired,
    setUserType: PropTypes.func.isRequired,
    setUserID: PropTypes.func.isRequired,
    setUserName: PropTypes.func.isRequired,
};

export default Login;
