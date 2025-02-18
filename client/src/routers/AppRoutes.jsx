import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import Layout from '../layout';

import SignIn from '../pages/user/signin/signin.jsx';
import SignUp from '../pages/user/signup/signup.jsx';

import Vouchers from '../pages/vouchers';
import GiftVouchers from '../pages/vouchers/gift-vouchers/gift-vouchers.jsx';

import AddVoucher from '../pages/vouchers/add-voucher/add-voucher.jsx';
import UpdateVoucher from '../pages/vouchers/update-voucher/update-voucher.jsx';
import Voucher from '../pages/vouchers/voucher/voucher.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <ProtectedRoute element={<Vouchers />} roles={['admin']} />
			},
			{
				path: 'signin',
				element: <SignIn />
			},
			{
				path: 'signup',
				element: <SignUp />
			},
			{
				path: 'add-voucher',
				element: <ProtectedRoute element={<AddVoucher />} roles={['admin']} />
			},
			{
				path: 'voucher/update/:id',
				element: <ProtectedRoute element={<UpdateVoucher />} roles={['admin']} />
			},
			{
				path: 'voucher/:id',
				element: <ProtectedRoute element={<Voucher />} roles={['user']} />
			},
			{
				path: 'gift/vouchers',
				element: <ProtectedRoute element={<GiftVouchers />} roles={['user']} />
			},
			{
				path: '*',
				element: <Navigate to='/' replace />
			}
		]
	}
]);

const AppRoutes = () => {
	return <RouterProvider router={router} />;
};

export default AppRoutes;
