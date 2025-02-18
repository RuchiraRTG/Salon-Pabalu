import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { addVoucher } from '../../../api/voucherAPI';

import './add-voucher.css';

const AddVoucher = () => {
	const [values, setValues] = useState([]);
	const [imgLink, setImgLink] = useState('');
	const [imgError, setImgError] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm();

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
			const response = await addVoucher(data);
			if (response.status === 201) {
				Swal.fire({
					icon: 'success',
					title: 'Success!',
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
				text: error.response?.data?.message || 'Failed to add voucher.'
			});
		}
	};

	const handleAddValue = (e) => {
		if (e.key === 'Enter' || e.type === 'click') {
			e.preventDefault();
			const newValue = e.target.value || document.getElementById('valueInput').value;

			if (newValue) {
				setValues((prevValues) => [...prevValues, newValue]);
				setValue('values', [...values, newValue]);
				document.getElementById('valueInput').value = '';
			}
		}
	};

	const handleRemoveValue = (index) => {
		const newValues = values.filter((_, i) => i !== index);
		setValues(newValues);
		setValue('values', newValues);
	};

	const handleImgLinkChange = (e) => {
		const newImgLink = e.target.value;
		setImgLink(newImgLink);
		setImgError(false);
		setValue('imgLink', newImgLink);
	};

	const handleImgError = () => {
		setImgError(true);
	};

	return (
		<div className='form-container'>
			<h1
				style={{
					textAlign: 'center',
					marginBottom: '20px'
				}}
			>
				Add Gift Voucher
			</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-group'>
					<label htmlFor='name'>Name</label>
					<input type='text' className='form-control' id='name' {...register('name', { required: true })} />
					{errors.name && <span className='error'>This field is required</span>}
				</div>

				<div className='form-group'>
					<label htmlFor='description'>Description</label>
					<textarea
						className='form-control'
						id='description'
						{...register('description', { required: true })}
					></textarea>
					{errors.description && <span className='error'>This field is required</span>}
				</div>

				<div className='form-group'>
					<label htmlFor='imgLink'>Image Link</label>
					<input
						type='text'
						className='form-control'
						id='imgLink'
						{...register('imgLink', { required: true })}
						onChange={handleImgLinkChange}
					/>
					{errors.imgLink && <span className='error'>This field is required</span>}
				</div>

				<div className='form-group'>
					{imgLink && (
						<div>
							<p style={{ marginBottom: '10px' }}>Preview:</p>
							{imgError ? (
								<div style={{ color: 'red' }}>Invalid Image Link</div>
							) : (
								<img
									src={imgLink}
									alt='Voucher Preview'
									style={{ width: '200px', height: '200px' }}
									onError={handleImgError}
								/>
							)}
						</div>
					)}
				</div>

				<div className='form-group'>
					<label htmlFor='values'>Prices</label>
					<div className='input-group'>
						<input
							id='valueInput'
							type='text'
							className='form-control'
							placeholder='Enter Price'
							onKeyDown={handleAddValue}
						/>
						<button type='button' className='btn btn-primary' onClick={handleAddValue}>
							+
						</button>
					</div>
					{errors.values && <span className='error'>This field is required</span>}
				</div>

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

				<div className='validity-quantity' style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
					<div className='form-group' style={{ flex: 1 }}>
						<label htmlFor='validity'>Number of Valid Days</label>
						<input
							type='number'
							className='form-control'
							id='validity'
							{...register('validity', { required: true, valueAsNumber: true })}
							min='1' // Prevent negative values
						/>
						{errors.validity && <span className='error'>This field is required</span>}
					</div>

					<div className='form-group' style={{ flex: 1 }}>
						<label htmlFor='quantity'>Quantity</label>
						<input
							type='number'
							className='form-control'
							id='quantity'
							{...register('quantity', { required: true, valueAsNumber: true })}
							min='1' // Prevent negative values
						/>
						{errors.quantity && <span className='error'>This field is required</span>}
					</div>
				</div>

				<button type='submit' className='submit-btn'>
					Add Voucher
				</button>
			</form>
		</div>
	);
};

export default AddVoucher;
