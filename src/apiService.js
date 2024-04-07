// apiService.js

const API_BASE_URL = "http://localhost:8000"; // Replace with your actual backend server hostname

/**
 * Generalized function to fetch data or send data to the backend.
 * @param {string} endpoint The endpoint path after the base URL.
 * @param {Object} options Additional options including method, headers, and body.
 * @returns {Promise<any>} The JSON response from the server.
 */
export const fetchData = async (endpoint, options = {}) => {
    const { method = 'GET', headers = {}, body = null } = options;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: method !== 'GET' ? JSON.stringify(body) : null,
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`There was a problem with the request: ${error}`);
        throw error; // Re-throwing to allow caller to handle it
    }
};
