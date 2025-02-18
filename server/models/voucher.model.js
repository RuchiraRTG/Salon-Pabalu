import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		imgLink: {
			type: String,
			required: true
		},
		values: [
			{
				type: Number,
				required: true
			}
		],
		validity: {
			type: Number,
			required: true
		},
		quantity: {
			type: Number,
			required: true
		}
	},
	{
		timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }
	}
);

export default mongoose.model('Voucher', VoucherSchema);
