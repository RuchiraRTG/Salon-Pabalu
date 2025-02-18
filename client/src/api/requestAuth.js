import { useAuthStore } from '../store/authStore';

// Get auth token from the store
const token = useAuthStore.getState().token;

const requestAuth = {
	headers: {
		'Authorization': `Bearer ${token}` || '',
		'Content-type': 'application/json'
	}
};

export default requestAuth;
