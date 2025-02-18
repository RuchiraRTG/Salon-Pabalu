import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVouchers } from '../../../api/voucherAPI'; // Import your API function
import './gift-vouchers.css';

const VoucherList = () => {
	const [vouchers, setVouchers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVouchers = async () => {
			try {
				const response = await getVouchers();
				if (Array.isArray(response.data)) {
					setVouchers(response.data);
				} else {
					setVouchers([]);
				}
				setLoading(false);
			} catch (err) {
				setError('Failed to load vouchers');
				setLoading(false);
			}
		};

		fetchVouchers();
	}, []);

	if (loading) return <p>Loading vouchers...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className='voucher-list-container'>
			<h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Gift Vouchers</h1>
			<div className='voucher-cards'>
				{vouchers.map((voucher) => (
					<div className='voucher-card' key={voucher._id}>
						<img src={voucher.imgLink} alt={voucher.name} className='voucher-image' />
						<div className='voucher-info'>
							<h2>{voucher.name}</h2>
							<p>{voucher.description}</p>
							<p style={{ color: 'red', fontSize: '1.5rem', fontWeight: 'bold' }}>Rs. {voucher.values[0]}</p>
							{/* <p>Validity: {new Date(voucher.validity).toLocaleDateString()}</p>
							<p>Quantity: {voucher.quantity}</p> */}
							<Link to={`/voucher/${voucher._id}`} className='see-more-button'>
								See More
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default VoucherList;
