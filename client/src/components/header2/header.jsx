import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.css'; // Importing the CSS module

const Header = () => {
	const { isAuthenticated, role } = useAuth();

	// Sign out function
	const signOut = async () => {
		const confirmLogout = await Swal.fire({
			title: 'Are you sure you want to sign out?',
			text: "You'll be logged out of the system.",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Sign Out'
		});

		if (confirmLogout.isConfirmed) {
			localStorage.clear();
			window.location.href = '/';
		}
	};

	return (
		<div className={styles.navbar}>
			<ul>
				<li>
					{role === 'admin' && (
						<NavLink className={`${styles.item} active`} to='/'>
							Manage Vouchers
						</NavLink>
					)}
					{role === 'user' && (
						<NavLink className={`${styles.item} active`} to='/gift/vouchers'>
							Gift Vouchers
						</NavLink>
					)}
					{!isAuthenticated && (
						<NavLink className={`${styles.item} active`} to='/'>
							Gift Vouchers
						</NavLink>
					)}
				</li>
				<li className={styles['nav-right']}>
					{isAuthenticated ? (
						<button className={styles.btn} onClick={signOut}>
							Sign Out
						</button>
					) : (
						<NavLink className={styles.btn} to='/signin'>
							Sign In
						</NavLink>
					)}
				</li>
			</ul>
		</div>
	);
};

export default Header;
