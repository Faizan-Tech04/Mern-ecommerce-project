import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

function CheckAuth({
    isAuthenticated,
    user,
}) {
    const location = useLocation();

    // ==========================================
    // Root Route
    // ==========================================

    if (location.pathname === "/") {
        if (!isAuthenticated) {
            return (
                <Navigate
                    to="/auth/login"
                    replace
                />
            );
        }

        if (user?.role === "admin") {
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/shop/home"
                replace
            />
        );
    }

    // ==========================================
    // User is NOT authenticated
    // ==========================================

    if (
        !isAuthenticated &&
        !location.pathname.includes(
            "/login"
        ) &&
        !location.pathname.includes(
            "/register"
        )
    ) {
        return (
            <Navigate
                to="/auth/login"
                replace
            />
        );
    }

    // ==========================================
    // User IS authenticated but trying
    // to access Login/Register
    // ==========================================

    if (
        isAuthenticated &&
        (location.pathname.includes(
            "/login"
        ) ||
            location.pathname.includes(
                "/register"
            ))
    ) {
        if (user?.role === "admin") {
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/shop/home"
                replace
            />
        );
    }

    // ==========================================
    // Normal User trying to access Admin
    // ==========================================

    if (
        isAuthenticated &&
        user?.role !== "admin" &&
        location.pathname.includes(
            "/admin"
        )
    ) {
        return (
            <Navigate
                to="/unauth-page"
                replace
            />
        );
    }

    // ==========================================
    // Admin trying to access Shopping
    // ==========================================

    if (
        isAuthenticated &&
        user?.role === "admin" &&
        location.pathname.includes(
            "/shop"
        )
    ) {
        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        );
    }

    // ==========================================
    // Normal Route
    // ==========================================

    return <Outlet />;
}

export default CheckAuth;