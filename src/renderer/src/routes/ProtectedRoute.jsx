import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuth, redirectTo }) => {
    return isAuth ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
