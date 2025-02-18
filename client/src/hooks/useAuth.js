import { useAuthStore } from '../store/authStore';

// Check if the user is authenticated
export const useAuth = () => {
	const { isAuthenticated, token, role } = useAuthStore();

	if (isAuthenticated && token && role) {
		return {
			isAuthenticated: isAuthenticated,
			role: role
		};
	} else {
		return {
			isAuthenticated: false,
			role: null
		};
	}
};
