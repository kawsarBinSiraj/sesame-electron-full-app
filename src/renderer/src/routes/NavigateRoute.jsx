import { Navigate, Outlet } from "react-router-dom";

const NavigateRoute = ({ isAuth, navigateTo }) => {
    return isAuth ? <Navigate to={navigateTo} replace /> : <Outlet />;
};

export default NavigateRoute;
