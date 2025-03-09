import React from "react";
import IntroImg from "@renderer/assets/images/intro.png";
import IntroAllImg from "@renderer/assets/images/intro-all.png";
import LOGO from "@renderer/assets/images/logo.svg";
import IntroComp from "@renderer/components/modules/auth/Intro.comp";
import workshopImg from "@renderer/assets/images/workshop.svg";
import brtcImg from "@renderer/assets/images/brtc.svg";
import govtImg from "@renderer/assets/images/govt.svg";
import eduImg from "@renderer/assets/images/edu.svg";
import allImg from "@renderer/assets/images/all.svg";
import { useTranslation } from "react-i18next";
import SignupComp from "@renderer/components/modules/auth/Signup.comp";
import SigninComp from "@renderer/components/modules/auth/Signin.comp";
import AnotherSignupComp from "@renderer/components/modules/auth/AnotherSignup.comp";

/**
 * @desc :- interface for Auth component
 * created_by :- Kawsar Bin Siraj (30/01/2025)
 */
interface AuthProps {
    context?: string;
}

const Auth: React.FC<AuthProps> = ({ context = "" }) => {
    const { t } = useTranslation();
    /**
     * @desc :- wrappingWithImage function
     * created_by :- Kawsar Bin Siraj (30/01/2025)
     */
    const wrappingWithContext = (context: string) => {
        switch (context) {
            case "intro":
                return { comp: <IntroComp />, src: IntroImg };
            case "signin":
                return { comp: <SigninComp />, src: IntroAllImg };
            case "signup":
                return { comp: <SignupComp />, src: IntroAllImg };
            case "another-signup":
                return { comp: <AnotherSignupComp />, src: IntroAllImg };
            default:
                return { comp: <IntroComp />, src: IntroImg };
        }
    };

    return (
        <div id="auth">
            <div className="container-fluid px-0">
                <div className="row  gx-0">
                    <div className="col-md-6">
                        <div className="wrappingWithContent-context p-4 text-center">
                            {context === "intro" ? (
                                <header className="intro-header d-flex align-items-center justify-content-between mb-3 mb-xl-4">
                                    <img src={eduImg} alt="LOGO" width={60} className="img-fluid" />
                                    <img src={govtImg} alt="LOGO" width={60} className="img-fluid" />
                                    <img src={brtcImg} alt="LOGO" width={60} className="img-fluid" />
                                </header>
                            ) : null}

                            <div className="context-area">
                                <img src={LOGO} alt="LOGO" width={220} className="img-fluid mb-3" />
                                <>{wrappingWithContext(context)?.comp}</>
                            </div>

                            <div className="credit mt-5">
                                {context === "intro" ? (
                                    <img src={workshopImg} alt="workshopImg" className="img-fluid d-block m-auto mb-2" />
                                ) : (
                                    <img src={allImg} alt="workshopImg" className="img-fluid d-block m-auto mb-3" />
                                )}
                                <p className="fs-6 fw-normal lang-switchable text-dark lh-base mb-0 d-inline-flex gap-1">
                                    {t("credit.developed_by")}
                                    <a className="text-decoration-none text-theme-3" href="https://riseuplabs.com/" target="_blank" rel="noreferrer">
                                        {t("credit.company")}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 d-none d-md-block">
                        <div className="wrappingWithImg-context">
                            <img id="img-context" src={wrappingWithContext(context)?.src} alt="Img" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
