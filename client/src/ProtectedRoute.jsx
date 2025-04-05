import { Navigate } from 'react-router-dom';
import { getToken } from './utils/auth';

const ProtectedRoute = ({ children }) => {
  if (!getToken()) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
