// apiService.js

const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your actual backend server hostname

export const fetchData = async (tableName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${tableName}/`);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("There was a problem fetching the enrollments:", error);
    }
};