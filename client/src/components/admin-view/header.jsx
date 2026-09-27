import { LogOut, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../ui/button";

import { logoutUser } from "../../store/auth-slice";

function AdminHeader({ setOpen }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logoutUser())
            .unwrap()
            .then((data) => {
                if (data?.success) {
                    toast.success("Logout successful! 👋");

                    navigate("/auth/login");
                }
            })
            .catch((error) => {
                console.error("Logout Error:", error);

                toast.error(
                    error?.message || "Logout failed. Please try again."
                );
            });
    }

    return (
        <header className="flex items-center justify-between border-b bg-background px-4 py-3">

            {/* Mobile Menu Button */}
            <Button
                type="button"
                onClick={() => setOpen(true)}
                className="lg:hidden"
            >
                <Menu />
                <span className="sr-only">
                    Toggle Menu
                </span>
            </Button>

            {/* Logout Button */}
            <div className="flex flex-1 justify-end">
                <Button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>

        </header>
    );
}

export default AdminHeader;