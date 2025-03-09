import { useState } from "react";
import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IFormInput {
    name: string;
    institute: string;
    identification: string | null;
    phone: string;
}

const SignupComp = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<IFormInput>();

    /**
     * @desc :- This function will be called when user click on the submit button
     * created_by :- Kawsar Bin Siraj (03/02/2025)
     */
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            setLoading(true);
            const { ipcRenderer } = window.Electron;
            if (data?.identification === "") data.identification = null;
            await ipcRenderer.invoke("create-user", data);
            setTimeout(() => navigate("/auth/another-signup"), 100);
        } catch (error) {
            const errMsg = (error as any).message;
            if (errMsg.includes("UNIQUE constraint failed: users.phone")) {
                setError("phone", {
                    type: "manual",
                    message: "This phone number is already exist",
                });
            }
            if (errMsg.includes("UNIQUE constraint failed: users.identification")) {
                setError("identification", {
                    type: "manual",
                    message: "This identification number is already exist",
                });
            }
        } finally {
            setTimeout(() => setLoading(false), 100);
        }
    };

    return (
        <div className="SignupComp">
            <h2 className="title text-theme-1 lang-switchable fw-500 mb-4"> {t("intro.create_new_user")}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="text-start m-auto" style={{ maxWidth: "425px" }}>
                <div className="from-group mb-3">
                    <label className="form-label fw-500 lang-switchable mb-1">{t("intro.name")}</label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "Required felid",
                            maxLength: { value: 40, message: "Max length is 40 characters" },
                            validate: (value) => {
                                if (value?.trim() === "") return "Only spaces are not allowed";
                                if (value && /^[^a-zA-Z0-9]+$/.test(value)) return "Only special characters are not allowed";
                                return true;
                            },
                        })}
                        className={`form-control shadow-none ${errors.name && "is-invalid"}`}
                        placeholder=""
                    />
                    {errors.name && <p className="text-danger err-msg small mb-0">{errors.name.message}</p>}
                </div>
                <div className="from-group mb-3">
                    <label className="form-label fw-500 lang-switchable mb-1">{t("intro.institute")}</label>
                    <input
                        type="text"
                        {...register("institute", {
                            required: "Required felid",
                            maxLength: { value: 40, message: "Max length is 40 characters" },
                            validate: (value) => {
                                if (value?.trim() === "") return "Only spaces are not allowed";
                                if (value && /^[^a-zA-Z0-9]+$/.test(value)) return "Only special characters are not allowed";
                                return true;
                            },
                        })}
                        className={`form-control shadow-none ${errors.institute && "is-invalid"}`}
                        placeholder=""
                    />
                    {errors.institute && <p className="text-danger err-msg small mb-0">{errors.institute.message}</p>}
                </div>
                <div className="from-group mb-4">
                    <label className="form-label fw-500 lang-switchable mb-1">{t("intro.phone")}</label>
                    <input
                        type="text"
                        {...register("phone", {
                            required: "Required felid",
                            validate: (value) => {
                                if (value?.trim() === "") return "Only spaces are not allowed";
                                if (!/^\d+$/.test(value)) return "Only numbers are allowed";
                                if (!value.startsWith("01")) return "Must start with 01";
                                if (value?.length != 11) return "Must be 11 digits";
                                return true;
                            },
                        })}
                        className={`form-control shadow-none ${errors.phone && "is-invalid"}`}
                        placeholder=""
                    />
                    {errors.phone && <p className="text-danger err-msg small mb-0">{errors.phone.message}</p>}
                </div>
                <div className="from-group mb-4">
                    <label className="form-label fw-500 lang-switchable mb-1">{t("intro.identification")}</label>
                    <input
                        type="text"
                        {...register("identification", {
                            maxLength: { value: 20, message: "Max length is 20 characters" },
                            validate: (value) => {
                                if (value && /^[^a-zA-Z0-9]+$/.test(value)) return "Only special characters are not allowed";
                                return true;
                            },
                        })}
                        className={`form-control shadow-none ${errors.identification && "is-invalid"}`}
                        placeholder=""
                    />
                    {errors.identification && <p className="text-danger err-msg small mb-0">{errors.identification.message}</p>}
                </div>
                <div className="form-group">
                    <button type="submit" disabled={loading} className="btn p-0 border-0 w-100">
                        <RippleButton className="btn lang-switchable fw-500 btn-signup text-light btn-theme-1 rounded-pill w-100">
                            {t("intro.create")}
                            {loading ? (
                                <div className="spinner-border spinner-border-sm border-1 ms-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : null}
                        </RippleButton>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignupComp;
