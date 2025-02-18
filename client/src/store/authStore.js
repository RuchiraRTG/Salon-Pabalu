import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const initialState = {
	isAuthenticated: false,
	email: null,
	role: null,
	token: null,
	firstName: null,
	lastName: null,
	gender: null,
	birthDay: null
};

const store = (set) => ({
	...initialState,
	login: (email, role, token, firstName, lastName, gender, birthDay) => {
		set({
			isAuthenticated: true,
			email,
			role,
			token,
			firstName,
			lastName,
			gender,
			birthDay
		});
	},
	logout: () => {
		set({
			isAuthenticated: false,
			email: null,
			role: null,
			token: null,
			firstName: null,
			lastName: null,
			gender: null,
			birthDay: null
		});
	},
	updateUser: (data) => {
		set((state) => ({
			email: {
				...state.email,
				...data
			}
		}));
	}
});

export const useAuthStore = create(devtools(persist(store, { name: 'authStore' }), 'authStore'));
