import axios from 'axios';

import ENV from '../configs';

// Set the base URL for the axios requests
axios.defaults.baseURL = ENV.API_URL;

// User login
export const loginUser = async (values) => {
	try {
		const response = await axios.post('/login', values);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// User registration
export const registerUser = async (values) => {
	try {
		const response = await axios.post('/register', values);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};
