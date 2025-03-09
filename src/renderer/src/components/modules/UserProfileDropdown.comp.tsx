import { useState, useEffect } from "react";
import useLoggedUser from "@renderer/hooks/useLoggedUser";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserProfileDropdownComp = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const loggedUser = useLoggedUser();
    const { t } = useTranslation();

    /**
     * @desc :- showHandler
     * created_by :- Kawsar Bin Siraj (06/02/2025)
     */
    const onShowHandler = (e: any) => {
        e.stopPropagation(); // Prevents event bubbling
        setShow((prev) => !prev); // Toggle visibility
    };

    /**
     * @desc :- handleOutsideClick
     * created_by :- Kawsar Bin Siraj (06/02/2025)
     */
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!document.getElementById("dropdown")?.contains(event.target as Node)) {
                setShow(false);
            }
        };

        if (show) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => document.removeEventListener("click", handleOutsideClick);
    }, [show]);

    /**
     * @desc :- onLogOut
     * created_by :- Kawsar Bin Siraj (11/02/2025)
     */
    const onLogOut = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className="UserProfileDropdownComp position-relative pt-1">
            <div className="profile-info d-inline-flex align-items-center gap-2">
                <img src={loggedUser?.avatar} alt="Avatar" className="img-fluid user-img me-1" />
                <p className="mb-0 user-name me-1">{loggedUser?.name}</p>
                <span
                    role="button"
                    className={`drop-icon ${show ? "show" : "hide"}`}
                    onClick={(e) => {
                        onShowHandler(e);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none">
                        <circle cx={13} cy={13} r={13} fill="#00B140" />
                        <path
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.25}
                            d="M17.371 13.002a.399.399 0 0 0 .795-.002.399.399 0 0 0-.397-.398.399.399 0 0 0-.398.4ZM12.604 13.002c0 .218.178.397.397.394a.399.399 0 0 0 .397-.397.399.399 0 0 0-.397-.397.399.399 0 0 0-.397.4ZM7.834 13.002c0 .218.179.397.397.394A.399.399 0 0 0 8.63 13a.399.399 0 0 0-.398-.397.4.4 0 0 0-.397.4Z"
                        />
                    </svg>
                </span>
            </div>
            <div id="dropdown" className={`UserProfileDropdownComp-menu bg-white w-100 rounded ${show ? "show" : "hide"}`}>
                <button
                    onClick={() => {
                        navigate("/profile");
                        setShow(false);
                    }}
                    type="button"
                    className="btn d-block lang-switchable rounded-0 w-100 text-start border-bottom"
                >
                    {t("profile.profile")}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        onLogOut();
                    }}
                    className="btn d-block lang-switchable w-100 rounded-0 text-start"
                >
                    {t("profile.logout")}
                </button>
            </div>
        </div>
    );
    -1;
};

export default UserProfileDropdownComp;
