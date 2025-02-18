import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { registerUser } from '../../../api/userAPI';

import styles from './signup.module.css';

const onSubmit = async (values) => {
	try {
		const response = await registerUser(values);
		if (response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Registration Successful',
				text: 'You have successfully registered',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			}).then(() => {
				window.location.href = '/signin';
			});
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Registration Failed',
			text: "User already exists with this email or couldn't register user",
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true
		});
	}
};

const SignUp = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm();

	const password = watch('password', '');

	const confirmPasswordMatch = (value) => {
		return value === password || ' Passwords do not match';
	};

	const today = new Date().toISOString().split('T')[0];

	return (
		<div className={styles.signupContainer}>
			<div className={styles.card}>
				<div className={styles.cardHeader}>Sign Up</div>
				<div className={styles.cardBody}>
					<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
						<div className={styles.formGroup}>
							<div className={styles.row} style={{ marginBottom: '1.5rem' }}>
								{/* First Name */}
								<div className={styles.col}>
									<label className={styles.label}>First Name</label>
									{errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
									<input
										className={styles.input}
										{...register('firstName', {
											required: ' ( required )',
											minLength: { value: 3, message: ' ( Least 3 characters long )' }
										})}
									/>
								</div>
								{/* Last Name */}
								<div className={styles.col}>
									<label className={styles.label}>Last Name</label>
									{errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
									<input
										className={styles.input}
										{...register('lastName', {
											required: ' ( required )',
											minLength: { value: 3, message: ' ( Least 3 characters long )' }
										})}
									/>
								</div>
							</div>
							{/* Email */}
							<div className={styles.formGroup}>
								<label className={styles.label}>E-mail</label>
								{errors.email && <span className={styles.error}>{errors.email.message}</span>}
								<input
									className={styles.input}
									{...register('email', {
										required: ' ( required )',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: ' ( Invalid email format )'
										}
									})}
								/>
							</div>
							<div className={styles.row} style={{ marginBottom: '1.5rem' }}>
								{/* Gender */}
								<div className={styles.col}>
									<label className={styles.label}>Gender</label>
									{errors.gender && <span className={styles.error}>{errors.gender.message}</span>}
									<select className={styles.input} {...register('gender', { required: ' ( required )' })}>
										<option value=''>Select gender</option>
										<option value='male'>Male</option>
										<option value='female'>Female</option>
									</select>
								</div>
								{/* Birth Day */}
								<div className={styles.col}>
									<label className={styles.label}>Date of Birth</label>
									{errors.birthDay && <span className={styles.error}>{errors.birthDay.message}</span>}
									<input
										type='date'
										className={styles.input}
										{...register('birthDay', { required: ' ( required )', max: today })}
										max={today}
									/>
								</div>
							</div>
							<div className={styles.row}>
								{/* Password */}
								<div className={styles.col}>
									<label className={styles.label}>Password</label>
									{errors.password && <span className={styles.error}>{errors.password.message}</span>}
									<input
										type='password'
										className={styles.input}
										{...register('password', {
											required: ' ( required )',
											minLength: { value: 8, message: ' ( Least 8 characters long )' }
										})}
									/>
								</div>
								{/* Confirm Password */}
								<div className={styles.col}>
									<label className={styles.label}>Confirm Password</label>
									{errors.confirmPassword && (
										<span className={styles.error}>{errors.confirmPassword.message}</span>
									)}
									<input
										type='password'
										className={styles.input}
										{...register('confirmPassword', {
											required: ' ( required )',
											validate: confirmPasswordMatch
										})}
									/>
								</div>
							</div>
						</div>
						{/* Sign Up Button */}
						<div className={styles.submitButtonContainer}>
							<button type='submit' className={styles.submitButton}>
								Sign Up
							</button>
						</div>
					</form>
					{/* Not a member */}
					<div className={styles.alreadyMember}>
						<p>
							Already registered? <Link to='/signin'>Sign In</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
