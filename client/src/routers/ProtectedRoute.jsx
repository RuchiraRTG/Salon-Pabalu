import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

/* Protected Route component */
export const ProtectedRoute = ({ element, roles }) => {
	const { isAuthenticated, role } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to='/signin' replace />;
	}

	if (roles && !roles.includes(role)) {
		return <Navigate to='/signin' replace />;
	}

	return element;
};

ProtectedRoute.propTypes = {
	element: PropTypes.node.isRequired,
	roles: PropTypes.arrayOf(PropTypes.string).isRequired
};
