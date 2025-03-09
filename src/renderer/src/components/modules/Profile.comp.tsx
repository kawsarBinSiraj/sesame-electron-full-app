import { useState, useEffect } from "react";
import RippleButton from "@renderer/components/modules/RippleButton.comp";
import useLoggedUser from "@renderer/hooks/useLoggedUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IFormInput {
    name?: string;
    institute?: string;
    identification?: string | null;
    phone?: string;
    avatar_id?: string;
}

const ProfileComp = () => {
    const { t } = useTranslation();
    const [show, setShow] = useState("default");
    const [loading, setLoading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<{ id: string; src: string } | null>(null);
    const [avatars, setAvatars] = useState<{ id: string; src: string }[]>([]);
    const loggedUser = useLoggedUser();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<IFormInput>();

    /**
     * @desc :- Update defaultValues when users are available
     * created_by :- Kawsar Bin Siraj (13/02/2025)
     */
    useEffect(() => {
        if (loggedUser) {
            reset({
                name: loggedUser.name,
                phone: loggedUser.phone,
                institute: loggedUser.institute,
                identification: loggedUser.identification,
            });
        }
    }, [loggedUser]);

    /**
     * @desc :- This function will be called when user click on the submit button
     * created_by :- Kawsar Bin Siraj (03/02/2025)
     */
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            setLoading(true);
            const { ipcRenderer } = window.Electron;
            if (data?.identification === "") data.identification = null;
            const updatedUser = await ipcRenderer.invoke("update-user", { ...data });
            if (updatedUser) {
                localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("storage"));
            }
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

    /**
     * @desc :- allUserAvatar
     * created_by :- Kawsar Bin Siraj (12/02/2025)
     */
    useEffect(() => {
        const allUserAvatar = async () => {
            try {
                const { ipcRenderer } = window.Electron;
                const avatars = await ipcRenderer.invoke("get-user-avatars");
                setAvatars(avatars);
            } catch (error) {
                if (process.env.NODE_ENV === "development") console.error(error);
            }
        };

        allUserAvatar();
    }, []);

    /**
     * @desc :- handleOutsideClick
     * created_by :- Kawsar Bin Siraj (06/02/2025)
     */
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const modal = document.getElementById("profile-modal")?.contains(event.target as Node);
            const btnEdit = document.getElementById("btn-edit-avatar")?.contains(event.target as Node);
            if (!modal && !btnEdit) {
                setShow("to-top");
                setSelectedAvatar(null);
                setTimeout(() => setShow("default"), 300);
            }
        };

        if (show) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => document.removeEventListener("click", handleOutsideClick);
    }, [show]);

    return (
        <div id="ProfileComp" className="position-relative pb-4">
            <div id="profile-modal" className={`profile-modal-context font-quicksand ${show}`}>
                <div className="modal-content">
                    <h3 className="page-title fs-2 fw-bold text-theme-1 fw-bold pt-5 px-5 mb-2 lang-switchable"> {t("profile.profile_avatar")}</h3>
                    <div className="modal-body text-center px-5 pb-4">
                        {loggedUser && <img src={loggedUser.avatar} data-id={loggedUser.id} alt="Avatar" style={{ width: 110 }} className="img-fluid user-img mb-4" />}
                        {avatars?.length ? (
                            <div className="avatar-list d-flex align-items-center justify-content-between gap-3">
                                {avatars.map((avatar, i) => {
                                    return (
                                        <img
                                            key={i}
                                            data-id={avatar.id}
                                            src={avatar?.src}
                                            alt="Avatar"
                                            style={{ width: 80 }}
                                            className={`img-fluid user-img ${selectedAvatar ? (selectedAvatar?.id == avatar?.id ? "disabled" : "no-border") : loggedUser?.avatar_id == avatar?.id ? "disabled" : "no-border"}`}
                                            onClick={() => setSelectedAvatar(avatar)}
                                        />
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                    <div className="modal-actions d-flex align-items-center justify-content-between border-top px-5 py-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShow("to-top");
                                setSelectedAvatar(null);
                                setTimeout(() => setShow("default"), 300);
                            }}
                            className="btn lang-switchable btn-outline-success border-theme-1 text-theme-1 rounded-pill px-5"
                        >
                            {t("profile.cancel")}
                        </button>
                        <RippleButton
                            onClickHandler={() => {
                                if (selectedAvatar?.id == loggedUser?.avatar_id) return;
                                const data = { avatar_id: selectedAvatar?.id };
                                onSubmit(data);
                                setShow("to-top");
                                setTimeout(() => setShow("default"), 300);
                            }}
                            className={`btn btn-signup lang-switchable text-light btn-theme-1 rounded-pill ${loading || !selectedAvatar || selectedAvatar?.id == loggedUser?.avatar_id ? "disabled" : ""}`}
                        >
                            {t("profile.update")}
                            {loading ? (
                                <div className="spinner-border spinner-border-sm border-1 ms-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : null}
                        </RippleButton>
                    </div>
                </div>
            </div>
            <div className="ProfileComp-content">
                <h2 className="user-name text-theme-1 fw-bold mb-4">
                    <span className="lang-switchable me-2">{t("profile.hello")}</span>
                    {loggedUser?.name}
                </h2>
                <div className="user-img-wrapper d-flex align-items-center gap-3 mb-4">
                    <img src={loggedUser?.avatar} alt="Avatar" style={{ width: 80 }} className="img-fluid user-img me-1" />
                    <button
                        id="btn-edit-avatar"
                        onClick={(e) => {
                            e.preventDefault();
                            setShow("from-bottom");
                        }}
                        type="button"
                        className="btn btn-sm btn-success bg-theme-1 border-0 d-inline-flex align-items-center gap-1 px-3"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_138_6101)">
                                <path
                                    d="M11.0833 7.02608C10.7607 7.02608 10.5 7.28744 10.5 7.60937V12.2761C10.5 12.5975 10.2386 12.8594 9.9167 12.8594H1.75C1.42796 12.8594 1.1667 12.5975 1.1667 12.2761V4.10937C1.1667 3.78798 1.42796 3.52608 1.75 3.52608H6.4167C6.73927 3.52608 7 3.26471 7 2.94278C7 2.62074 6.73927 2.35938 6.4167 2.35938H1.75C0.785171 2.35938 0 3.14455 0 4.10937V12.2761C0 13.2409 0.785171 14.0261 1.75 14.0261H9.9167C10.8815 14.0261 11.6667 13.2409 11.6667 12.2761V7.60937C11.6667 7.2868 11.4059 7.02608 11.0833 7.02608Z"
                                    fill="white"
                                />
                                <path
                                    d="M5.47063 6.49423C5.42983 6.53503 5.40238 6.58694 5.39073 6.64291L4.97833 8.70566C4.95911 8.80125 4.98944 8.89984 5.05823 8.96927C5.11366 9.0247 5.18833 9.0544 5.2648 9.0544C5.28339 9.0544 5.30272 9.05269 5.32195 9.04863L7.38405 8.63623C7.44119 8.62448 7.4931 8.59714 7.53337 8.55623L12.1487 3.9409L10.0866 1.87891L5.47063 6.49423Z"
                                    fill="white"
                                />
                                <path
                                    d="M13.5725 0.453922C13.0038 -0.114849 12.0786 -0.114849 11.5104 0.453922L10.7031 1.2612L12.7652 3.32331L13.5725 2.51592C13.8479 2.2412 13.9995 1.87484 13.9995 1.48519C13.9995 1.09554 13.8479 0.729176 13.5725 0.453922Z"
                                    fill="white"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_138_6101">
                                    <rect width="14" height="14" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        Edit
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="text-start" style={{ maxWidth: "600px" }}>
                    <div className="from-group mb-3">
                        <label className="form-label fw-500 lang-switchable mb-1">{t("intro.name")}</label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Required field",
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
                                    if (value && !/^\d+$/.test(value)) return "Only numbers are allowed";
                                    if (!(value ?? "").startsWith("01")) return "Must start with 01";
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
                        <button type="submit" disabled={loading} className="btn p-0  border-0 w-100">
                            <RippleButton className="btn btn-signup text-light btn-theme-1 rounded-pill w-100 lang-switchable ">
                                {t("profile.save")}
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
        </div>
    );
};

export default ProfileComp;
