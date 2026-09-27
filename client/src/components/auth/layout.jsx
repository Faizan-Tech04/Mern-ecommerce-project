import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">

            {/* Left Side */}
            <div className="hidden lg:flex w-1/2 bg-black items-center justify-center">
                <h1 className="text-white text-4xl font-bold text-center">
                    Welcome to Ecommerce Shopping
                </h1>
            </div>

            {/* Right Side */}
            <div className="flex w-full lg:w-1/2 items-center justify-center">
                <Outlet />
            </div>

        </div>
    );
}

export default AuthLayout;