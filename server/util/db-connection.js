import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_URI;

// Create Database Connection
const connectDB = async () => {
	try {
		mongoose.set('strictQuery', true);
		await mongoose.connect(uri);
		console.log('MongoDB connected successfully');
		return true;
	} catch (error) {
		console.log('Cannot connect to MongoDB');
		return false;
	}
};

export default connectDB;
