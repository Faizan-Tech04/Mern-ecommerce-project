import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

function CheckAuth({
    isAuthenticated,
    user,
    isLoading,
}) {
    const location = useLocation();

    // ==========================================
    // Wait until authentication check completes
    // ==========================================

    if (isLoading) {
        return null;
    }

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
        !location.pathname.includes("/login") &&
        !location.pathname.includes("/register")
    ) {
        return (
            <Navigate
                to="/auth/login"
                replace
            />
        );
    }

    // ==========================================
    // Authenticated user trying Login/Register
    // ==========================================

    if (
        isAuthenticated &&
        (
            location.pathname.includes("/login") ||
            location.pathname.includes("/register")
        )
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
    // Normal User trying Admin
    // ==========================================

    if (
        isAuthenticated &&
        user?.role !== "admin" &&
        location.pathname.includes("/admin")
    ) {
        return (
            <Navigate
                to="/unauth-page"
                replace
            />
        );
    }

    // ==========================================
    // Admin trying Shopping
    // ==========================================

    if (
        isAuthenticated &&
        user?.role === "admin" &&
        location.pathname.includes("/shop")
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