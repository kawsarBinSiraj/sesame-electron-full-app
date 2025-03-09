import { useState, useEffect } from "react";
import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SigninComp = () => {
    interface User {
        id: string;
        name: string;
        institute: string;
        identification: string;
        phone: string;
        avatar: string;
    }
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();

    /**
     * @desc :- useEffect for users reset
     * created_by :- Kawsar Bin Siraj (12/02/2025)
     */
    useEffect(() => {
        if (users?.length > 0) {
            // Update defaultValues when users are available
            reset({
                userId: users[0].id, // Set first user ID as default
            });
        }
    }, [users, reset]); // Re-run when `users` changes

    /**
     * @desc :- This function will be called when user click on the submit button
     * created_by :- Kawsar Bin Siraj (03/02/2025)
     */
    const onSubmit = (data: any) => {
        try {
            const userId = data?.userId;
            const selectedUser = users.find((user) => user.id == userId);
            if (selectedUser) {
                localStorage.setItem("loggedUser", JSON.stringify(selectedUser));
                window.dispatchEvent(new Event("storage"));
                setTimeout(() => navigate("/"), 100);
            }
        } catch (error) {
            console.log(error, "errors from signin");
        }
    };

    /**
     * @desc :- getUsers
     * created_by :- Kawsar Bin Siraj (12/02/2025)
     */

    useEffect(() => {
        const getUsers = async () => {
            try {
                const { ipcRenderer } = window.Electron;
                const users = await ipcRenderer.invoke("get-users");
                setUsers(users);
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, []);

    return (
        <div className="SigninComp text-center">
            <h2
                className="title text-theme-1 lang-switchable lh-sm fw-500 mb-4 mt-3"
                dangerouslySetInnerHTML={{ __html: t("intro.select_username").replace(/\n/g, "<br />") }}
            ></h2>
            <form onSubmit={handleSubmit(onSubmit)} className="m-auto" style={{ maxWidth: "425px" }}>
                <div className="from-group mb-4">
                    <select {...register("userId")} className="form-select shadow-none" aria-label="Default select example">
                        {users.map((user) => {
                            return (
                                <option key={user.id} value={user.id}>
                                    {user?.name} ({user?.phone})
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn p-0 border-0 w-100">
                        <RippleButton className="btn fw-500 lang-switchable btn-signup d-inline-flex align-items-center justify-content-center text-light btn-theme-1 rounded-pill w-100">
                            {t("intro.enter")}
                        </RippleButton>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SigninComp;
