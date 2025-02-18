import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { loginUser } from '../../../api/userAPI';
import { useAuthStore } from '../../../store/authStore';

import styles from './signin.module.css';

export default function SignIn() {
	const { login } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	const onSubmit = async (values) => {
		try {
			const response = await loginUser(values);
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Login Successful',
					text: 'You have successfully logged in',
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					willClose: () => {
						const redirectUrl = response.data.user.role === 'admin' ? '/' : '/gift/vouchers';
						window.location.replace(redirectUrl);
					}
				}).then(() => {
					login(
						response.data.user.email,
						response.data.user.role,
						response.data.token,
						response.data.user.firstName,
						response.data.user.lastName,
						response.data.user.gender,
						response.data.user.birthDay
					);
				});
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Login Failed',
				text: error.message || 'Invalid Credentials!',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			});
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.cardHeader}>Sign In</div>
				<div className={styles.cardBody}>
					<form className='needs-validation' onSubmit={handleSubmit(onSubmit)}>
						<div className='mt-4 mb-5'>
							<div className={`${styles.formGroup} mb-4`}>
								<label className='mb-2'>E-mail</label>
								{errors.email && <span className={styles.textDanger}>{errors.email.message}</span>}
								<input
									className={styles.formControl}
									{...register('email', {
										required: ' ( Email is required )',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: ' ( Invalid email format )'
										}
									})}
								/>
							</div>
							<div className={`${styles.formGroup} mb-2`}>
								<label className='mb-2'>Password</label>
								{errors.password && <span className={styles.textDanger}> ( Password is required )</span>}
								<input
									type='password'
									className={styles.formControl}
									{...register('password', { required: true })}
								/>
							</div>
						</div>
						<div className={styles.textCenter}>
							<button type='submit' className={styles.btnSecondary}>
								Sign In
							</button>
						</div>
					</form>
					{/* Not a member */}
					<div className={styles.textCenter} style={{ marginTop: '1rem' }}>
						<p className='mb-0'>
							Not a member? <Link to='/signup'>Register</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
