import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVouchers, deleteVoucher } from '../../api/voucherAPI'; // Import the API function
import Swal from 'sweetalert2'; // Import SweetAlert
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF autoTable for tables
import './index.css';

const Vouchers = () => {
	// State to hold the list of vouchers
	const [vouchers, setVouchers] = useState([]);
	const [filteredVouchers, setFilteredVouchers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const navigate = useNavigate();

	// Fetch vouchers when the component mounts
	useEffect(() => {
		const fetchVouchers = async () => {
			try {
				const response = await getVouchers();
				if (Array.isArray(response.data)) {
					setVouchers(response.data);
					setFilteredVouchers(response.data); // Initialize filtered vouchers
				} else {
					setVouchers([]); // Ensure vouchers is always an array
				}
				setLoading(false);
			} catch (err) {
				setError('Failed to load vouchers');
				setLoading(false);
			}
		};

		fetchVouchers();
	}, []);

	// Update filtered vouchers based on search and date filters
	useEffect(() => {
		const filterVouchers = () => {
			let results = vouchers;

			// Filter by search term
			if (searchTerm) {
				results = results.filter((voucher) => voucher.name.toLowerCase().includes(searchTerm.toLowerCase()));
			}

			// Filter by date range
			if (startDate) {
				results = results.filter((voucher) => new Date(voucher.createdAt) >= new Date(startDate));
			}
			if (endDate) {
				results = results.filter((voucher) => new Date(voucher.createdAt) <= new Date(endDate));
			}

			setFilteredVouchers(results);
		};

		filterVouchers();
	}, [searchTerm, startDate, endDate, vouchers]);

	const handleEdit = (voucherId) => () => {
		navigate(`voucher/update/${voucherId}`);
	};

	// Handle delete voucher
	const handleDelete = (voucherId) => async () => {
		const result = await Swal.fire({
			title: 'Are you sure?',
			text: 'You will not be able to recover this voucher!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, keep it'
		});

		if (result.isConfirmed) {
			try {
				await deleteVoucher(voucherId);
				Swal.fire('Deleted!', 'Voucher has been deleted.', 'success');
				setVouchers(vouchers.filter((voucher) => voucher._id !== voucherId));
			} catch (error) {
				Swal.fire('Error!', 'Failed to delete voucher.', 'error');
			}
		}
	};

	// Download report as PDF
	const downloadReport = () => {
		const doc = new jsPDF();
		doc.setFontSize(12);
		doc.text('Voucher Stock Report', 14, 10); // Add a title

		// Prepare the table data
		const tableData = filteredVouchers.map((voucher) => [
			new Date(voucher.createdAt).toDateString(),
			voucher.name,
			voucher.values.map((value) => `Rs. ${value}`).join(', '),
			`${voucher.validity} Days`,
			voucher.quantity
		]);

		// Define column headers
		const columns = ['Date', 'Voucher Name', 'Values', 'Validity', 'Quantity'];

		// Add the table to the document
		doc.autoTable({
			head: [columns],
			body: tableData,
			startY: 20,
			margin: { horizontal: 10 },
			styles: {
				overflow: 'linebreak',
				cellPadding: 5,
				fontSize: 10,
				valign: 'middle'
			},
			theme: 'grid'
		});

		// Calculate total voucher count and available stock
		const totalVouchers = filteredVouchers.length;
		const totalStock = filteredVouchers.reduce((sum, voucher) => sum + voucher.quantity, 0);

		// Display totals below the table
		const finalY = doc.lastAutoTable.finalY + 10; // Position below the table
		doc.text(`Total Vouchers: ${totalVouchers}`, 14, finalY);
		doc.text(`Total Available Stock: ${totalStock}`, 14, finalY + 10);

		// Save the PDF
		doc.save('vouchers_report.pdf');
	};

	if (loading) return <p>Loading vouchers...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className='vouchers-container'>
			{/* justify center items */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{/* Header */}
				<h1
					style={{
						marginBottom: '1rem'
					}}
				>
					Vouchers
				</h1>

				{/* Link button */}
				<button onClick={() => navigate('/add-voucher')} className='add-button' style={{ verticalAlign: 'middle' }}>
					<span>Add Voucher </span>
				</button>
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				{/* Search and Filter Inputs */}
				<div className='filters' style={{ display: 'flex', gap: '10px' }}>
					<input
						type='text'
						placeholder='Search by name'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
					<input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
				</div>
				<button onClick={downloadReport} className='download-button'>
					Report{' '}
					<span role='img' aria-label='download'>
						📥
					</span>
				</button>
			</div>

			{/* Table to display vouchers */}
			{filteredVouchers.length > 0 ? (
				<table className='vouchers-table'>
					<thead>
						<tr>
							<th
								style={{
									minWidth: '150px'
								}}
							>
								Title
							</th>
							<th>Description</th>
							<th>Image</th>
							<th
								style={{
									minWidth: '100px'
								}}
							>
								Values
							</th>
							<th>Validity</th>
							<th>Quantity</th>
							<th style={{ textAlign: 'center', minWidth: '150px' }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredVouchers.map((voucher) => (
							<tr key={voucher._id}>
								<td>{voucher.name}</td>
								<td>{voucher.description}</td>
								<td>
									<img src={voucher.imgLink} alt={voucher.name} className='voucher-img' />
								</td>
								<td>
									{voucher.values.map((value, index) => (
										<div key={index}>
											{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'LKR' }).format(value)}
										</div>
									))}
								</td>

								<td>{voucher.validity} Days</td>
								<td>{voucher.quantity}</td>
								<td>
									<button onClick={handleEdit(voucher._id)} className='edit-button'>
										Edit
									</button>
									<button onClick={handleDelete(voucher._id)} className='delete-button'>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No vouchers available</p>
			)}
		</div>
	);
};

export default Vouchers;
