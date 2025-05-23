import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();

    /**
     * @desc :- onNavigateTo
     * created_by :- Kawsar Bin Siraj (04/02/2025)
     */
    const onNavigateTo = (path: string) => {
        navigate(path);
    };
    return (
        <nav id="sidebar" className="position-sticky lang-switchable" style={{ top: "calc(var(--header-height) + 1px)" }}>
            <RippleButton
                onClickHandler={() => {
                    onNavigateTo("/");
                }}
                rippleDelay={0}
                className={`btn nav-link rounded-pill w-100 ${(pathname === "/" || ["/chapter-docs", "/chapter-complete"].includes(pathname)) && "active"}`}
            >
                <b className="icon">
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_208_4150)">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.11902 1.11719C5.47858 1.15127 6.71039 1.58832 10.0028 2.46821C13.2952 1.58832 14.5213 1.15127 18.8866 1.11719C19.0171 1.11719 19.1307 1.16829 19.2272 1.25911C19.318 1.35562 19.3691 1.46915 19.3691 1.5997V16.6993C19.3691 16.9604 19.1534 17.1761 18.8922 17.1761C15.6963 17.2102 12.5005 17.6019 10.2298 18.8223C10.0823 18.9018 9.91764 18.9018 9.77572 18.8223C7.49945 17.6019 4.30357 17.2102 1.10768 17.1761C0.846546 17.1761 0.630859 16.9604 0.630859 16.6993V1.5997C0.630859 1.46915 0.681918 1.35562 0.772742 1.25911C0.869252 1.16829 0.982781 1.11719 1.11902 1.11719Z"
                                fill="#D1D1D6"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19.3691 15.7344V16.6994C19.3691 16.9605 19.1534 17.1762 18.8922 17.1762C15.6963 17.2103 12.5005 17.602 10.2298 18.8224C10.0823 18.9019 9.91764 18.9019 9.77572 18.8224C7.49945 17.602 4.30357 17.2103 1.10768 17.1762C0.846546 17.1762 0.630859 16.9605 0.630859 16.6994V15.7344C0.630859 16.0012 0.846546 16.2112 1.10768 16.2169C4.30357 16.251 7.49945 16.637 9.77572 17.8574C9.91764 17.9369 10.0823 17.9369 10.2298 17.8574C12.5005 16.637 15.6963 16.251 18.8922 16.2169C19.1534 16.2112 19.3691 16.0012 19.3691 15.7344Z"
                                fill="#B1B1B5"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.002 2.46821C13.2943 1.58832 14.5205 1.15127 18.8858 1.11719C19.0163 1.11719 19.1298 1.16829 19.2263 1.25911C19.3172 1.35562 19.3682 1.46915 19.3682 1.5997V16.6993C19.3682 16.9604 19.1525 17.1761 18.8914 17.1761C15.6955 17.2102 12.4996 17.6019 10.229 18.8223C10.1552 18.862 10.0758 18.8791 10.002 18.8791V2.46821Z"
                                fill="#ECEFF1"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M19.3682 15.7344V16.6994C19.3682 16.9605 19.1525 17.1762 18.8914 17.1762C15.6955 17.2103 12.4996 17.602 10.229 18.8224C10.1552 18.8621 10.0758 18.8792 10.002 18.8792V17.9199C10.0758 17.9199 10.1552 17.8972 10.229 17.8574C12.4996 16.637 15.6955 16.251 18.8914 16.2169C19.1525 16.2112 19.3682 16.0012 19.3682 15.7344Z"
                                fill="#D1D1D6"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16.8693 6.18359C16.9717 6.18359 17.07 6.22426 17.1425 6.29673C17.2149 6.36916 17.2556 6.46744 17.2556 6.56991V13.4291C17.2556 13.5316 17.2149 13.6299 17.1425 13.7023C17.07 13.7748 16.9717 13.8154 16.8693 13.8154H12.5406C12.4382 13.8154 12.3399 13.7748 12.2674 13.7023C12.195 13.6299 12.1543 13.5316 12.1543 13.4291V6.56991C12.1543 6.46744 12.195 6.36916 12.2674 6.29673C12.3399 6.22426 12.4382 6.18359 12.5406 6.18359H16.8693Z"
                                fill="#8AC9FE"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.1288 13.8154H12.5406C12.4382 13.8154 12.3399 13.7748 12.2674 13.7023C12.195 13.6299 12.1543 13.5316 12.1543 13.4291V6.56991C12.1543 6.46744 12.195 6.36916 12.2674 6.29673C12.3399 6.22426 12.4382 6.18359 12.5406 6.18359H13.1288C13.0264 6.18359 12.9281 6.22426 12.8557 6.29673C12.7832 6.36916 12.7425 6.46744 12.7425 6.56991V13.4291C12.7425 13.5316 12.7832 13.6299 12.8557 13.7023C12.9281 13.7748 13.0264 13.8154 13.1288 13.8154Z"
                                fill="#60B7FF"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.04313 5.83127C6.00788 5.85978 5.95941 5.86546 5.9185 5.84593C5.8776 5.82636 5.85156 5.78507 5.85156 5.73978V1.45703C6.6376 1.59236 7.36682 1.76825 8.1916 1.98562V5.73978C8.1916 5.78507 8.1656 5.82636 8.1247 5.84593C8.0838 5.86546 8.03529 5.85978 8.00003 5.83127L7.0216 5.04084L6.04313 5.83127Z"
                                fill="#FFE177"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.24372 5.66923L6.04313 5.83127C6.00788 5.85978 5.95941 5.86546 5.9185 5.84593C5.8776 5.82636 5.85156 5.78507 5.85156 5.73978V1.45703C5.98364 1.47978 6.11411 1.50366 6.24372 1.52872V5.66923ZM8.1916 5.66923V5.73978C8.1916 5.78507 8.1656 5.82636 8.1247 5.84593C8.0838 5.86546 8.03529 5.85978 8.00003 5.83127L7.0216 5.04084L7.21768 4.88244L8.1916 5.66923Z"
                                fill="#FFD064"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.84304 19.2287C7.47618 17.8613 4.005 17.4894 0.589116 17.4894C0.415861 17.4894 0.275391 17.3489 0.275391 17.1757V1.04224C0.275391 0.868986 0.415861 0.728516 0.589116 0.728516C5.37516 0.728516 6.60629 1.16518 10 2.07597C13.3955 1.16518 14.6266 0.728516 19.4126 0.728516C19.5859 0.728516 19.7264 0.868986 19.7264 1.04224V17.1757C19.7264 17.3489 19.5859 17.4894 19.4126 17.4894C15.9968 17.4894 12.5238 17.8613 10.1569 19.2287C10.0598 19.2848 9.94014 19.2848 9.84304 19.2287ZM5.5381 1.65267C4.33606 1.46314 2.96563 1.36546 0.902842 1.35663V16.863C4.11343 16.8855 7.33837 17.2598 9.68625 18.4326V2.64138C9.26257 2.52726 8.87308 2.42095 8.50559 2.32236V5.91467C8.50559 6.03554 8.43618 6.14565 8.32712 6.19777C8.21806 6.24985 8.08876 6.23467 7.99472 6.15871L7.02186 5.37279L6.04896 6.15871C5.95496 6.23467 5.82567 6.24985 5.71661 6.19777C5.60755 6.14565 5.5381 6.03554 5.5381 5.91467V1.65267ZM10.3137 18.4326C12.6618 17.2598 15.8883 16.8855 19.0989 16.863V1.35663C14.7226 1.37538 13.4626 1.79389 10.3137 2.64138V18.4326ZM7.87814 2.15648C7.28417 2.00263 6.73394 1.87138 6.16555 1.76236V5.25793L6.82472 4.72542C6.9397 4.63252 7.10398 4.63252 7.219 4.72542L7.87814 5.25793V2.15648ZM2.62994 13.0436C2.4568 13.0436 2.31621 12.903 2.31621 12.7298C2.31621 12.5567 2.4568 12.4161 2.62994 12.4161H7.8537C8.02684 12.4161 8.16743 12.5567 8.16743 12.7298C8.16743 12.903 8.02684 13.0436 7.8537 13.0436H2.62994ZM2.62994 10.9989C2.4568 10.9989 2.31621 10.8584 2.31621 10.6852C2.31621 10.5121 2.4568 10.3715 2.62994 10.3715H7.8537C8.02684 10.3715 8.16743 10.5121 8.16743 10.6852C8.16743 10.8584 8.02684 10.9989 7.8537 10.9989H2.62994ZM2.62994 8.95432C2.4568 8.95432 2.31621 8.81373 2.31621 8.64059C2.31621 8.46742 2.4568 8.32687 2.62994 8.32687H7.8537C8.02684 8.32687 8.16743 8.46742 8.16743 8.64059C8.16743 8.81373 8.02684 8.95432 7.8537 8.95432H2.62994ZM16.8706 5.87001C17.0563 5.87001 17.2344 5.94373 17.3657 6.07503C17.4969 6.20632 17.5707 6.38436 17.5707 6.57004V13.4293C17.5707 13.6149 17.4969 13.793 17.3657 13.9243C17.2344 14.0556 17.0563 14.1293 16.8706 14.1293H12.542C12.3563 14.1293 12.1783 14.0556 12.047 13.9243C11.9157 13.793 11.8419 13.6149 11.8419 13.4293V6.57004C11.8419 6.38436 11.9157 6.20632 12.047 6.07503C12.1783 5.94373 12.3563 5.87001 12.542 5.87001H16.8706ZM16.8706 6.49746H12.542C12.5227 6.49746 12.5043 6.5051 12.4906 6.51871C12.477 6.53232 12.4694 6.55079 12.4694 6.57004V13.4293C12.4694 13.4485 12.477 13.467 12.4906 13.4806C12.5043 13.4942 12.5227 13.5018 12.542 13.5018H16.8706C16.8899 13.5018 16.9084 13.4942 16.922 13.4806C16.9356 13.467 16.9432 13.4485 16.9432 13.4293V6.57004C16.9432 6.55079 16.9356 6.53232 16.922 6.51871C16.9084 6.5051 16.8899 6.49746 16.8706 6.49746Z"
                                fill="black"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_208_4150">
                                <rect width={20} height={20} fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </b>
                <b className="text"> {t("sidebar.chapters")}</b>
            </RippleButton>
            <RippleButton
                onClickHandler={() => {
                    onNavigateTo("/quiz");
                }}
                rippleDelay={0}
                className={`btn nav-link rounded-pill w-100 ${["/quiz", "/quiz-paper"].includes(pathname) && "active"}`}
            >
                <b className="icon">
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_208_4165)">
                            <path d="M0.617188 2.57812L1.44562 1.74969L3.17056 3.47463L2.34213 4.30307L0.617188 2.57812Z" fill="#FFD503" />
                            <path d="M0 5.85938H2.38512V7.03125H0V5.85938Z" fill="#FFD503" />
                            <path d="M0.628906 10.2969L2.35214 8.57365L3.18057 9.40208L1.45734 11.1253L0.628906 10.2969Z" fill="#FFD503" />
                            <path d="M16.8281 3.47656L18.5531 1.75162L19.3815 2.58005L17.6566 4.305L16.8281 3.47656Z" fill="#FFD503" />
                            <path d="M17.6152 5.85938H20.0004V7.03125H17.6152V5.85938Z" fill="#FFD503" />
                            <path d="M16.8145 9.4043L17.6429 8.57586L19.3661 10.2991L18.5377 11.1275L16.8145 9.4043Z" fill="#FFD503" />
                            <path d="M10 20C11.6154 20 12.9297 18.6857 12.9297 17.0703V15.2344H7.07031V17.0703C7.07031 18.6857 8.38465 20 10 20Z" fill="#FFD503" />
                            <path
                                d="M16.3465 5.30719C15.8144 2.23219 13.145 0 9.99964 0C6.85425 0 4.18491 2.23219 3.65276 5.30777C3.28425 7.43867 3.98866 9.59875 5.53702 11.0848C6.36644 11.8811 6.87054 12.9447 7.00909 14.0625H12.9903C13.129 12.9443 13.633 11.8809 14.4623 11.0848C16.0107 9.59875 16.715 7.43867 16.3465 5.30719ZM10.5856 10.5469H9.4137V9.375H10.5856V10.5469ZM11.0411 6.68957C10.7558 6.89961 10.5856 7.23602 10.5856 7.58953V8.20312H9.4137V7.58953C9.4137 6.86504 9.76233 6.17586 10.3463 5.7459C10.4984 5.63395 10.5856 5.46176 10.5856 5.27344C10.5856 4.95035 10.3227 4.6875 9.99964 4.6875C9.67655 4.6875 9.4137 4.95035 9.4137 5.27344V5.85938H8.24183V5.27344C8.24183 4.30418 9.03038 3.51562 9.99964 3.51562C10.9689 3.51562 11.7575 4.30418 11.7575 5.27344C11.7575 5.82992 11.4897 6.35934 11.0411 6.68957Z"
                                fill="#00B140"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_208_4165">
                                <rect width={20} height={20} fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </b>
                <b className="text"> {t("sidebar.quiz")}</b>
            </RippleButton>
            <RippleButton
                onClickHandler={() => {
                    onNavigateTo("/result");
                }}
                rippleDelay={0}
                className={`btn nav-link rounded-pill w-100 ${["/result", "/answer-paper"].includes(pathname) && "active"}`}
            >
                <b className="icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 15.625C10 12.8681 12.2431 10.625 15 10.625C15.4325 10.625 15.8494 10.6856 16.25 10.7894V3.75C16.25 2.02438 14.8506 0.625 13.125 0.625H5.625C3.89938 0.625 2.5 2.02438 2.5 3.75V14.375C2.5 16.1006 3.89938 17.5 5.625 17.5H10.3681C10.1325 16.9206 10 16.2881 10 15.625ZM5.625 3.75H10.625C10.9706 3.75 11.25 4.03 11.25 4.375C11.25 4.72 10.9706 5 10.625 5H5.625C5.27938 5 5 4.72 5 4.375C5 4.03 5.27938 3.75 5.625 3.75ZM5.625 6.875H13.125C13.4706 6.875 13.75 7.155 13.75 7.5C13.75 7.845 13.4706 8.125 13.125 8.125H5.625C5.27938 8.125 5 7.845 5 7.5C5 7.155 5.27938 6.875 5.625 6.875ZM7.7375 14.375H5.625C5.27938 14.375 5 14.095 5 13.75C5 13.405 5.27938 13.125 5.625 13.125H7.7375C8.08313 13.125 8.3625 13.405 8.3625 13.75C8.3625 14.095 8.08313 14.375 7.7375 14.375ZM9.41875 11.25H5.625C5.27938 11.25 5 10.97 5 10.625C5 10.28 5.27938 10 5.625 10H9.41875C9.76437 10 10.0437 10.28 10.0437 10.625C10.0437 10.97 9.76437 11.25 9.41875 11.25Z"
                            fill="#00B140"
                        />
                        <path
                            d="M15 11.875C12.9325 11.875 11.25 13.5575 11.25 15.625C11.25 17.6925 12.9325 19.375 15 19.375C17.0675 19.375 18.75 17.6925 18.75 15.625C18.75 13.5575 17.0675 11.875 15 11.875ZM16.6919 15.3587L15.025 17.0256C14.9031 17.1475 14.7431 17.2088 14.5831 17.2088C14.4231 17.2088 14.2631 17.1475 14.1412 17.0256L13.3081 16.1925C13.0637 15.9481 13.0637 15.5531 13.3081 15.3087C13.5525 15.0644 13.9475 15.0644 14.1919 15.3087L14.5831 15.7L15.8081 14.4756C16.0525 14.2312 16.4475 14.2312 16.6919 14.4756C16.9363 14.72 16.9363 15.1156 16.6919 15.3594V15.3587Z"
                            fill="#FFD503"
                        />
                    </svg>
                </b>
                <b className="text"> {t("sidebar.my_result")}</b>
            </RippleButton>
            <RippleButton
                onClickHandler={() => {
                    onNavigateTo("/certificate");
                }}
                rippleDelay={0}
                className={`btn nav-link rounded-pill w-100 ${pathname === "/certificate" && "active"}`}
            >
                <b className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22">
                        <g fill="#FFD503" clipPath="url(#clip0_208_4176)">
                            <path d="m21.209 18.557-2.523-5.41a9.33 9.33 0 0 1-6.086 3.91l2.112 4.53a.717.717 0 0 0 1.323-.058l1.082-2.974.223-.104 2.974 1.082c.597.22 1.164-.399.895-.976M11 0C6.654 0 3.116 3.537 3.116 7.885c0 4.349 3.538 7.886 7.886 7.886s7.885-3.538 7.885-7.886S15.35 0 11.001 0m3.838 7.306L13.439 8.67l.33 1.925a.718.718 0 0 1-1.04.756l-1.728-.909-1.729.909a.718.718 0 0 1-1.04-.756l.33-1.925-1.398-1.363a.717.717 0 0 1 .397-1.223l1.933-.28.864-1.752a.717.717 0 0 1 1.285 0l.865 1.752 1.932.28a.717.717 0 0 1 .398 1.223M3.315 13.147l-2.523 5.41c-.271.58.302 1.195.894.976l2.974-1.082.223.104 1.083 2.974a.717.717 0 0 0 1.323.057L9.4 17.057a9.33 9.33 0 0 1-6.086-3.91"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_208_4176">
                                <path fill="#fff" d="M0 0h22v22H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                </b>
                <b className="text"> {t("sidebar.my_certificate")}</b>
            </RippleButton>
            <RippleButton
                onClickHandler={() => {
                    onNavigateTo("/about");
                }}
                rippleDelay={0}
                className={`btn nav-link rounded-pill w-100 ${pathname === "/about" && "active"}`}
            >
                <b className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path
                            fill="#00B140"
                            fillRule="evenodd"
                            d="M3.328 2.51c1.83.206 4.28.759 6.046 1.972v12.8c-1.766-1.213-4.217-1.765-6.046-1.972-.915-.103-1.662-.867-1.662-1.81V4.113c0-.943.747-1.707 1.662-1.604m9.197 13.786a9.5 9.5 0 0 0-1.9.987V4.482c1.765-1.213 4.216-1.766 6.046-1.973.915-.103 1.662.661 1.662 1.604v7.9a4.167 4.167 0 0 0-5.808 4.283M4.262 6.26a.625.625 0 1 0-.192 1.236c1.024.158 2.155.42 3.204.826a.625.625 0 0 0 .45-1.166c-1.154-.447-2.377-.728-3.462-.896m-.714 3.856a.625.625 0 0 1 .714-.522c.55.085 1.133.199 1.724.348a.625.625 0 0 1-.306 1.212 18 18 0 0 0-1.61-.325.625.625 0 0 1-.522-.713m12.285 5.091c.345 0 .625.28.625.625v2.5a.625.625 0 0 1-1.25 0v-2.5c0-.345.28-.625.625-.625m0-1.041a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </b>
                <b className="text"> {t("sidebar.about")}</b>
            </RippleButton>
        </nav>
    );
};

export default Sidebar;
