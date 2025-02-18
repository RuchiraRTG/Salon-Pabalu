import { useAuthStore } from '../store/authStore';
import { useAuth } from './useAuth';
// import { Avatar } from 'react-avatar';

// Return public user data
export const UseData = () => {
	const isAuthenticated = useAuth();
	const { email, firstName, lastName, gender, birthDay } = useAuthStore();

	if (isAuthenticated) {
		return {
			email,
			firstName,
			lastName,
			gender,
			birthDay
		};
	}
};
