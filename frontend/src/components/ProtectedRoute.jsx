import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Role restriction
    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {
        // Send user to the correct dashboard
        if (role === "ADMIN") {
            return <Navigate to="/dashboard" replace />;
        }

        return <Navigate to="/candidate-dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;