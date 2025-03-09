import Img from "@renderer/assets/images/circle-check.svg";
import EkriImg from "@renderer/assets/images/ekri.svg";
import { useTranslation } from "react-i18next";

const NotApplicableForCertificate = () => {
    const { t } = useTranslation();

    return (
        <div className="NotApplicableForCertificate">
            <div className="ChapterCompleteComp-inner-wrapper p-4">
                <div style={{ maxWidth: "800px" }} className="ChapterCompleteComp-inner text-center theme-shadow-1 rounded overflow-hidden pt-5">
                    <img src={Img} alt="Chapter Complete" className="img-fluid" />
                    <h2 className="title text-secondary lang-switchable fs-2 fw-bold fw-500 my-4" dangerouslySetInnerHTML={{ __html: t("certificate.no_certificate").replace(/\n/g, "<br />") }}></h2>
                    <p className="mb-0 text-dark fw-500 lang-switchable mb-3" dangerouslySetInnerHTML={{ __html: t("certificate.no_certificate_desc").replace(/\n/g, "<br />") }}></p>
                    <div className="text-end pe-5">
                        <img src={EkriImg} alt="Chapter Complete" className="img-fluid" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotApplicableForCertificate;
