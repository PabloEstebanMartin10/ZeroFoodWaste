import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const ProtectedRoute = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext missing");
  const { user } = auth; 
  
  const isAuthenticated = !!user; 

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;