import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import UserSchema from '../models/user.model.js';
import { userRegistrationSchema, userLoginSchema } from '../validations/user.validation.js';

// Register a new user
export async function registerUser(req, res) {
	try {
		// Validate incoming data against Zod schema
		const validatedData = await userRegistrationSchema.parseAsync(req.body);

		// Check for existing user with the same email
		const [userExist] = await Promise.all([UserSchema.findOne({ email: validatedData.email })]);
		if (userExist) {
			res.status(400).send('User already exists');
			return;
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(validatedData.password, 10);

		// Create the new user with validated data
		const newUser = new UserSchema({
			...validatedData, // Spreading validated data for clarity
			password: hashedPassword
		});

		// Save the user
		await newUser.save();

		res.status(201).send({ msg: 'User created successfully' });
	} catch (error) {
		// Handle Zod validation errors
		if (error instanceof ZodError) {
			res.status(400).send({ errors: error.issues });
		} else {
			console.error(error);
			res.status(500).send({ msg: "Internal Server Error: Couldn't register user" });
		}
	}
}

// Login a user
export async function loginUser(req, res) {
	try {
		// Validate incoming data against Zod schema
		const validatedData = await userLoginSchema.parseAsync(req.body);
		const { email, password } = validatedData;
		try {
			// Check for existing user with the same email
			const user = await UserSchema.findOne({ email });

			if (!user) {
				return res.status(404).send({ msg: 'User Not Found!' });
			}

			// Check password
			UserSchema.findOne({ email }).then((user) => {
				bcrypt.compare(password, user.password).then((passwordCheck) => {
					if (passwordCheck) {
						// Send JWT token
						const token = jwt.sign(
							{
								userId: user._id,
								email: user.email,
								firstName: user.firstName,
								lastName: user.lastName,
								role: user.role
							},
							process.env.JWT_SECRET,
							{ expiresIn: '24h' }
						);

						return res.status(200).send({
							msg: 'Login Successful',
							token: token,
							user: {
								userId: user._id,
								role: user.role,
								firstName: user.firstName,
								lastName: user.lastName,
								email: user.email
							}
						});
					} else {
						res.status(401).send({ msg: 'Invalid Password' });
					}
				});
			});
		} catch (error) {
			res.status(500).send({ msg: 'User Not Found!' });
		}
	} catch (error) {
		// Handle Zod validation errors
		if (error instanceof ZodError) {
			res.status(400).send({ errors: error.issues });
		} else {
			res.status(500).send({ msg: "Internal Server Error: Couldn't login user" });
		}
	}
}
