import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { getVoucherById, updateVoucher } from '../../../api/voucherAPI';

import './update-voucher.css';

const UpdateVoucher = () => {
	const { id } = useParams(); // Get the voucher ID from the URL
	const [values, setValues] = useState([]);
	const [imgLink, setImgLink] = useState(''); // Store imgLink in state
	const [imgError, setImgError] = useState(false); // Track if image failed to load
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm();

	// Fetch the voucher details when the component mounts
	useEffect(() => {
		const fetchVoucher = async () => {
			try {
				const response = await getVoucherById(id);
				const voucherData = response.data;

				// Set the form fields with existing data
				setValues(voucherData.values);
				setValue('name', voucherData.name);
				setValue('description', voucherData.description);
				setValue('imgLink', voucherData.imgLink);
				setImgLink(voucherData.imgLink); // Set the image link in state
				setValue('quantity', voucherData.quantity);
				setValue('validity', voucherData.validity);
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error!',
					text: 'Failed to fetch voucher data.'
				});
			}
		};

		fetchVoucher();
	}, [id, setValue]);

	const onSubmit = async (data) => {
		if (values.length === 0) {
			Swal.fire({
				icon: 'error',
				title: 'Invalid Input',
				text: 'Please add at least one price.'
			});
			return;
		}

		try {
			data.values = values.map((value) => Number(value));
			const response = await updateVoucher(id, data);
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Updated!',
					text: response.data.message,
					showConfirmButton: false,
					timer: 1500,
					timerProgressBar: true,
					willClose: () => window.location.replace('/vouchers')
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error!',
				text: error.response?.data?.message || 'Failed to update voucher.'
			});
		}
	};

	// Handle Enter key or "+" button click to add new value to the array
	const handleAddValue = (e) => {
		if (e.key === 'Enter' || e.type === 'click') {
			e.preventDefault(); // Prevent the form from submitting when Enter is pressed
			const newValue = e.target.value || document.getElementById('valueInput').value;

			if (newValue) {
				setValues((prevValues) => [...prevValues, newValue]); // Add value to array
				setValue('values', [...values, newValue]); // Update the form data
				document.getElementById('valueInput').value = ''; // Clear the input field
			}
		}
	};

	// Remove a value from the array
	const handleRemoveValue = (index) => {
		const newValues = values.filter((_, i) => i !== index);
		setValues(newValues);
		setValue('values', newValues);
	};

	// Handle imgLink change
	const handleImgLinkChange = (e) => {
		const newImgLink = e.target.value;
		setImgLink(newImgLink); // Update the imgLink state
		setImgError(false); // Reset image error in case of valid new image
		setValue('imgLink', newImgLink); // Update form value
	};

	// Handle image loading error
	const handleImgError = () => {
		setImgError(true); // Mark the image as invalid
	};

	return (
		<div className='form-container' style={{ marginTop: '50px', marginBottom: '50px' }}>
			<h1
				style={{
					textAlign: 'center',
					marginBottom: '20px'
				}}
			>
				Update Gift Voucher
			</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Name */}
				<div className='form-group'>
					<label htmlFor='name'>Name</label>
					<input type='text' className='form-control' id='name' {...register('name', { required: true })} />
					{errors.name && <span className='error'>This field is required</span>}
				</div>

				{/* Description */}
				<div className='form-group'>
					<label htmlFor='description'>Description</label>
					<textarea
						className='form-control'
						id='description'
						{...register('description', { required: true })}
					></textarea>
					{errors.description && <span className='error'>This field is required</span>}
				</div>

				{/* Image Link */}
				<div className='form-group'>
					<label htmlFor='imgLink'>Image Link</label>
					<input
						type='text'
						className='form-control'
						id='imgLink'
						{...register('imgLink', { required: true })}
						onChange={handleImgLinkChange} // Update imgLink dynamically
					/>
					{errors.imgLink && <span className='error'>This field is required</span>}
				</div>

				{/* Image Preview */}
				<div className='form-group'>
					{imgLink && (
						<div>
							<p style={{ marginBottom: '5px' }}>Image Preview:</p>
							{imgError ? (
								<div style={{ color: 'red' }}>Invalid Image Link</div>
							) : (
								<img
									src={imgLink}
									alt='Voucher Preview'
									style={{ width: '200px', height: '200px' }}
									onError={handleImgError} // Set error flag if image fails to load
								/>
							)}
						</div>
					)}
				</div>

				{/* Values */}
				<div className='form-group'>
					<label htmlFor='values'>Prices</label>
					<div className='input-group'>
						<input
							id='valueInput'
							type='text'
							className='form-control'
							placeholder='Enter Price'
							onKeyDown={handleAddValue} // Add value on Enter key
						/>
						<button type='button' className='btn btn-primary' onClick={handleAddValue}>
							+
						</button>
					</div>
					{errors.values && <span className='error'>This field is required</span>}
				</div>

				{/* Display list of added values */}
				<ul className='form-ul'>
					{values.map((value, index) => (
						<li key={index}>
							Rs. {value}{' '}
							<button type='button' onClick={() => handleRemoveValue(index)}>
								-
							</button>
						</li>
					))}
				</ul>

				<div style={{ display: 'flex', gap: '50px', marginTop: '20px' }}>
					{/* Validity */}
					<div className='form-group' style={{ flex: 1 }}>
						<label htmlFor='validity'>Number of Valid Days</label>
						<input
							type='number'
							className='form-control'
							id='validity'
							{...register('validity', { required: true, valueAsNumber: true })}
						/>
						{errors.validity && <span className='error'>This field is required</span>}
					</div>

					{/* Quantity */}
					<div className='form-group' style={{ flex: 1 }}>
						<label htmlFor='quantity'>Quantity</label>
						<input
							type='number'
							className='form-control'
							id='quantity'
							{...register('quantity', { required: true, valueAsNumber: true })}
						/>
						{errors.quantity && <span className='error'>This field is required</span>}
					</div>
				</div>

				<button type='submit' className='submit-btn'>
					Update Voucher
				</button>
			</form>
		</div>
	);
};

export default UpdateVoucher;
