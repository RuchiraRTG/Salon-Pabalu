import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVoucherById } from '../../../api/voucherAPI'; // Adjust the import based on your API structure
import './voucher.css';
import Swal from 'sweetalert2';

const Voucher = () => {
	const { id } = useParams();
	const [voucher, setVoucher] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedValue, setSelectedValue] = useState('');

	useEffect(() => {
		const fetchVoucher = async () => {
			try {
				const response = await getVoucherById(id);
				setVoucher(response.data);
				setLoading(false);
			} catch (err) {
				setError('Failed to load voucher details');
				setLoading(false);
			}
		};

		fetchVoucher();
	}, [id]);

	const formatDate = (validityDays) => {
		const today = new Date();
		const validityDate = new Date(today);
		validityDate.setDate(today.getDate() + validityDays);
		return validityDate.toDateString();
	};

	const handlePurchase = () => {
		if (selectedValue) {
			Swal.fire({
				icon: 'success',
				title: 'Success!',
				text: `Purchased Rs. ${selectedValue} voucher for ${voucher.name}.`,
				showConfirmButton: false
			});
		} else {
			Swal.fire({
				icon: 'info',
				title: 'Select Voucher Value',
				text: 'Please select a voucher value to purchase.'
			});
		}
	};

	if (loading) return <p>Loading voucher details...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className='voucher-container'>
			<img src={voucher.imgLink} alt={voucher.name} className='voucher-image-50' />
			<div className='details'>
				<h1
					style={{
						marginBottom: '1rem'
					}}
				>
					{voucher.name}
				</h1>
				<p style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
					{voucher.description}
				</p>
				<p style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
					Valid till:{' '}
					<span style={{ color: 'red', fontSize: '1rem' }}>
						{voucher.validity} Days - {formatDate(voucher.validity)}
					</span>
				</p>
				{/* Show availability badge */}
				{voucher.quantity > 0 ? (
					<p style={{ color: 'green', marginBottom: '1rem', fontSize: '1.5rem ' }}>Available</p>
				) : (
					<p style={{ color: 'red', marginBottom: '1rem', fontSize: '1.5rem ' }}>Out of Stock</p>
				)}

				{/* Voucher Value Selection */}
				<div className='value-selection'>
					<p>Select Voucher Price:</p>
					<div className='value-options'>
						{voucher.values.map((value, index) => (
							<label key={index} className={`value-button ${selectedValue === value ? 'selected' : ''}`}>
								<input
									type='radio'
									name='voucherValue'
									value={value}
									checked={selectedValue === value}
									onChange={() => setSelectedValue(value)}
								/>
								Rs. {value}
							</label>
						))}
					</div>
				</div>

				<button className='purchase-button' onClick={handlePurchase}>
					Buy Voucher
				</button>
			</div>
		</div>
	);
};

export default Voucher;
