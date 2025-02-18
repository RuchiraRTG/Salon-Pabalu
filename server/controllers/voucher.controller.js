import { ZodError } from 'zod';
import VoucherSchema from '../models/voucher.model.js';
import { addVoucherSchema, updateVoucherSchema } from '../validations/voucher.validation.js';

// Add a new Voucher
export const addVoucher = async (req, res) => {
	try {
		// Parse and validate the input data
		const result = addVoucherSchema.safeParse(req.body);

		// If validation fails, throw an error
		if (!result.success) {
			throw result.error;
		}

		// Extract the validated data
		const data = result.data;

		// Create a new Voucher
		const newVoucher = new VoucherSchema(data);

		// Save the new Voucher
		await newVoucher.save();

		// Send a success response
		res.status(201).json({ message: 'Voucher added successfully', data: newVoucher });
	} catch (error) {
		// Handle both ZodError and other errors
		if (error instanceof ZodError) {
			res.status(400).json({ message: 'Validation failed', errors: error.errors });
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
};

// Update an existing Voucher
export const updateVoucher = async (req, res) => {
	try {
		// Parse and validate the input data
		const result = updateVoucherSchema.safeParse(req.body);

		// If validation fails, throw an error
		if (!result.success) {
			throw result.error;
		}

		// Extract the validated data
		const data = result.data;

		// Find the Voucher by ID and update it
		const updatedVoucher = await VoucherSchema.findByIdAndUpdate(req.params.id, data, {
			new: true
		});

		// If the Voucher is not found, send an error response
		if (!updatedVoucher) {
			return res.status(404).json({ message: 'Voucher not found' });
		}

		// Send a success response
		res.json({ message: 'Voucher updated successfully', data: updatedVoucher });
	} catch (error) {
		// Handle both ZodError and other errors
		if (error instanceof ZodError) {
			res.status(400).json({ message: 'Validation failed', errors: error.errors });
		} else {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
};

// Delete an existing Voucher
export const deleteVoucher = async (req, res) => {
	try {
		// Find the Voucher by ID and delete it
		const deletedVoucher = await VoucherSchema.findByIdAndDelete(req.params.id);

		// If the Voucher is not found, send an error response
		if (!deletedVoucher) {
			return res.status(404).json({ message: 'Voucher not found' });
		}

		// Send a success response
		res.json({ message: 'Voucher deleted successfully' });
	} catch (error) {
		// Send an error response
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Get all Vouchers
export const getVouchers = async (req, res) => {
	try {
		// Fetch all Vouchers
		const vouchers = await VoucherSchema.find();

		// Send a success response
		res.json(vouchers);
	} catch (error) {
		// Send an error response
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Get a single Voucher by ID
export const getVoucherById = async (req, res) => {
	try {
		// Find the Voucher by ID
		const voucher = await VoucherSchema.findById(req.params.id);

		// If the Voucher is not found, send an error response
		if (!voucher) {
			return res.status(404).json({ message: 'Voucher not found' });
		}

		// Send a success response
		res.json(voucher);
	} catch (error) {
		// Send an error response
		res.status(500).json({ message: 'Internal Server Error' });
	}
};
