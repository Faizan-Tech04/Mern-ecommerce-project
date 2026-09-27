import { Outlet } from "react-router-dom";

import ShoppingHeader from "./header";

function ShoppingLayout() {
    return (
        <div
            className="
                flex
                min-h-screen
                w-full
                min-w-0
                flex-col
                bg-white
            "
        >

            {/* ==========================================
                Common Shopping Header
            ========================================== */}

            <ShoppingHeader />

            {/* ==========================================
                Shopping Main Content
            ========================================== */}

            <main
                className="
                    w-full
                    min-w-0
                    max-w-full
                    flex-1
                    overflow-x-hidden
                "
            >
                <div
                    className="
                        w-full
                        min-w-0
                        max-w-full
                    "
                >
                    <Outlet />
                </div>
            </main>

        </div>
    );
}

export default ShoppingLayout;