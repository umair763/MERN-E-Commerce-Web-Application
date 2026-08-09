import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, userRoles } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login based on requested roles
    if (allowedRoles.includes('super_admin')) {
      return <Navigate to="/super-admin/signin" replace />;
    }
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/admin/signin" replace />;
    }
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      // Redirect to appropriate login based on requested roles
      if (allowedRoles.includes('super_admin')) {
        return <Navigate to="/super-admin/signin" replace />;
      }
      if (allowedRoles.includes('admin')) {
        return <Navigate to="/admin/signin" replace />;
      }
      return <Navigate to="/signin" replace />;
    }
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
