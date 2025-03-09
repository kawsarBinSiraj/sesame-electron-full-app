import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AnotherSignupComp = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="AnotherSignupComp">
            <h2 className="title text-theme-1 lang-switchable fw-500 mb-2 mb-xl-3">{t("intro.title_1")}</h2>
            <h2 className="title fw-bold text-dark lang-switchable lh-base" dangerouslySetInnerHTML={{ __html: t("intro.title_2").replace(/\n/g, "<br />") }} />
            <p className="desc fs-5 fw-500 text-dark lang-switchable lh-base mb-3" dangerouslySetInnerHTML={{ __html: t("intro.desc").replace(/\n/g, "<br />") }} />
            <div className="ripple-container mb-3">
                <RippleButton
                    onClickHandler={() => {
                        navigate("/auth/signin");
                    }}
                    className="btn fw-500 lang-switchable btn-signup d-inline-flex align-items-center justify-content-center text-light btn-theme-1 rounded-pill"
                >
                    {t("intro.signin")}
                </RippleButton>
            </div>
            <div className="ripple-container">
                <RippleButton
                    onClickHandler={() => {
                        navigate("/auth/signup");
                    }}
                    className="btn fw-500 lang-switchable btn-signup d-inline-flex align-items-center justify-content-center text-theme-1 border-theme-1 rounded-pill"
                    style={{ "--bg-anim": "#00b140" }}
                >
                    {t("intro.another_signup")}
                </RippleButton>
            </div>
        </div>
    );
};

export default AnotherSignupComp;
