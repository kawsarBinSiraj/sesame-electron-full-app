import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileDropdownComp from "./UserProfileDropdown.comp";

const BreadcrumbsComp = () => {
    const navigate = useNavigate();
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    // Update button states on mount & navigation changes
    useEffect(() => {
        const updateNavState = () => {
            setCanGoBack(window.history.length > 1);
            setCanGoForward(false); // There's no reliable way to check forward history
        };

        updateNavState();
        window.addEventListener("popstate", updateNavState); // Listen for browser navigation

        return () => {
            window.removeEventListener("popstate", updateNavState);
        };
    }, []);

    /**
     * @desc :- goBack
     * created_by :- Kawsar Bin Siraj (04/02/2025)
     */
    const goBack = () => {
        if (canGoBack) {
            navigate(-1);
        }
    };

    /**
     * @desc :- goForward
     * created_by :- Kawsar Bin Siraj (04/02/2025)
     */
    const goForward = () => {
        if (canGoForward) {
            navigate(1);
        }
    };

    return (
        <div className="BreadcrumbsComp py-2 d-flex align-items-center">
            <div className="breadcrumbs-actions d-inline-flex gap-4 align-items-center">
                <button onClick={goBack} disabled={!canGoBack} type="button" className="btn border-0 p-0">
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.26465 14.9873L0.682129 8.5625C0.524414 8.40479 0.441406 8.21387 0.441406 8.00635C0.441406 7.79053 0.532715 7.58301 0.69043 7.4502L7.26465 1.01709C7.40576 0.875977 7.58838 0.792969 7.8042 0.792969C8.23584 0.792969 8.55957 1.125 8.55957 1.55664C8.55957 1.75586 8.47656 1.95508 8.34375 2.09619L2.30078 8.00635L8.34375 13.9165C8.47656 14.0576 8.55957 14.2485 8.55957 14.4561C8.55957 14.8877 8.23584 15.2114 7.8042 15.2114C7.58838 15.2114 7.40576 15.1284 7.26465 14.9873Z"
                            fill="#737373"
                        />
                    </svg>
                </button>
                <button onClick={goForward} disabled={!canGoForward} type="button" className="btn border-0 p-0">
                    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.19678 15.2197C1.4126 15.2197 1.59521 15.1367 1.73633 14.9956L8.31885 8.5625C8.47656 8.40479 8.55957 8.21387 8.55957 8.00635C8.55957 7.79053 8.47656 7.59131 8.31885 7.4502L1.74463 1.02539C1.59521 0.875977 1.4126 0.792969 1.19678 0.792969C0.765137 0.792969 0.441406 1.125 0.441406 1.55664C0.441406 1.75586 0.524414 1.95508 0.657227 2.09619L6.7002 8.00635L0.657227 13.9165C0.524414 14.0576 0.441406 14.2485 0.441406 14.4561C0.441406 14.8877 0.765137 15.2197 1.19678 15.2197Z"
                            fill="#737373"
                        />
                    </svg>
                </button>
            </div>
            <div className="right-end ms-auto">
                <UserProfileDropdownComp />
            </div>
        </div>
    );
};

export default BreadcrumbsComp;
