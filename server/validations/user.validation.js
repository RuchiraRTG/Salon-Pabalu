import { z } from 'zod';

export const userRegistrationSchema = z.object({
	firstName: z.string().min(3, { message: 'First name must be at least 3 characters long' }),
	lastName: z.string().min(3, { message: 'Last name must be at least 3 characters long' }),
	email: z.string().email({ message: 'Invalid email format' }),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const userLoginSchema = z.object({
	email: z.string().email({ message: 'Invalid email format' }),
	password: z.string().min(8, { message: 'Please Check Your Password' })
});
