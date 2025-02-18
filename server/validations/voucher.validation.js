import { z } from 'zod';

export const addVoucherSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	imgLink: z.string().url({ message: 'Invalid image link' }),
	values: z.array(z.number(), { message: 'Values must be an array of numbers' }),
	validity: z.number().int().positive({ message: 'Validity must be a positive integer' }),
	quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' })
});

export const updateVoucherSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	imgLink: z.string().url({ message: 'Invalid image link' }),
	values: z.array(z.number(), { message: 'Values must be an array of numbers' }),
	validity: z.number().int().positive({ message: 'Validity must be a positive integer' }),
	quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' })
});
