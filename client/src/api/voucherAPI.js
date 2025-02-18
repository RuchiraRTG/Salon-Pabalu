import axios from 'axios';
import requestAuth from './requestAuth';
import ENV from '../configs';

// Set the base URL for the axios requests
axios.defaults.baseURL = ENV.API_URL;

// Add a voucher
export const addVoucher = async (values) => {
	try {
		const response = await axios.post('/voucher', values, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Update a voucher
export const updateVoucher = async (voucherId, values) => {
	try {
		const response = await axios.put(`/voucher/${voucherId}`, values, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Delete a voucher
export const deleteVoucher = async (voucherId) => {
	try {
		const response = await axios.delete(`/voucher/${voucherId}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get all vouchers
export const getVouchers = async () => {
	try {
		const response = await axios.get('/vouchers', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get team details (User)
export const getVoucherById = async (voucherId) => {
	try {
		const response = await axios.get(`/voucher/${voucherId}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};
