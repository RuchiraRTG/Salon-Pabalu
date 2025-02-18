import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to check if the user is authenticated as a user
export async function AuthUser(req, res, next) {
	try {
		// Get the token from the request header
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check Special role access
		if (decoded.role !== 'user') {
			return res.status(401).json({
				msg: 'Access denied'
			});
		}

		// Attach the user to the request object
		req.user = decoded;

		// Move to the next middleware
		next();
	} catch (error) {
		return res.status(401).json({
			msg: 'Authentication failed'
		});
	}
}

// Middleware to check if the user is authenticated as a admin
export async function AuthAdmin(req, res, next) {
	try {
		// Get the token from the request header
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check Special role access
		if (decoded.role !== 'admin') {
			return res.status(401).json({
				msg: 'Access denied'
			});
		}

		// Attach the user to the request object
		req.user = decoded;

		// Move to the next middleware
		next();
	} catch (error) {
		return res.status(401).json({
			msg: 'Authentication failed Admin'
		});
	}
}

// Middleware to check if the user is authenticated as a user or admin
export async function AuthUserOrAdmin(req, res, next) {
	try {
		// Get the token from the request header
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Attach the user to the request object
		req.user = decoded;

		// Move to the next middleware
		next();
	} catch (error) {
		return res.status(401).json({
			msg: 'Authentication failed'
		});
	}
}
