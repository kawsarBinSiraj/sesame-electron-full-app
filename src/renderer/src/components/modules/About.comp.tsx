
import brtcImg from "@renderer/assets/images/brtc.svg";
import govtImg from "@renderer/assets/images/govt.svg";
import eduImg from "@renderer/assets/images/edu.svg";
import riseup from "@renderer/assets/images/riseup.svg";
import isf from "@renderer/assets/images/isf.svg";
import workshop from "@renderer/assets/images/workshop.svg";
import { useTranslation } from "react-i18next";

const AboutComp = () => {
    const { t } = useTranslation();
    return (
        <div className="AboutComp lang-switchable">
            <h2 className="page-title fs-2 fw-bold mb-5 text-theme-1">{t("about.about")}</h2>
            <div className="tagline d-flex align-items-center gap-4 mb-5">
                <p className="mb-0 flex-shrink-0">{t("about.produced_by")}:</p>
                <div className="images flex-grow-1 d-flex align-items-center gap-4">
                    <img src={isf} alt="brtcImg" className="img-fluid" />
                    <img src={workshop} alt="govtImg" className="img-fluid" />
                </div>
            </div>
            <div className="tagline d-flex align-items-center gap-4 mb-5">
                <p className="mb-0">{t("about.support")}:</p>
                <div className="images d-flex align-items-center gap-4">
                    <img src={brtcImg} alt="brtcImg" className="img-fluid" />
                    <img src={govtImg} alt="govtImg" className="img-fluid" />
                    <img src={eduImg} alt="eduImg" className="img-fluid" />
                </div>
            </div>
            <div className="tagline d-flex align-items-center gap-4">
                <p className="mb-0">{t("about.developed_by")}:</p>
                <img src={riseup} alt="riseup" className="img-fluid" />
            </div>
        </div>
    );
};

export default AboutComp;
