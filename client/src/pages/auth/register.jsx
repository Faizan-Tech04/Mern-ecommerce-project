import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import CommonForm from "../../components/common/form";
import { registerFormControls } from "../../config";
import { registerUser } from "../../store/auth-slice";

const initialState = {
    userName: "",
    email: "",
    password: "",
};

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();

        dispatch(registerUser(formData))
            .unwrap()
            .then((data) => {
                console.log("Register Success:", data);

                toast.success(data.message);

                navigate("/auth/login");
            })
            .catch((error) => {
                console.log("Register Error:", error);

                toast.error(error?.message || "Registration failed");
            });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Create New Account
                </h1>

                <p className="mt-2">
                    Already have an Account?

                    <Link
                        className="ml-2 font-medium text-primary hover:underline"
                        to="/auth/login"
                    >
                        Login
                    </Link>
                </p>
            </div>

            <CommonForm
                formControls={registerFormControls}
                buttonText="Sign Up"
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthRegister;