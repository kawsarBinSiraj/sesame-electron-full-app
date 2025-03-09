import { useLocation, useNavigate } from "react-router-dom";
import chapterCompleteImg from "@renderer/assets/images/chapter-complete.png";
import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useTranslation } from "react-i18next";

const ChapterCompleteComp = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const chapterName = queryParams.get("name");
    const chapterDesc = queryParams.get("desc");
    const chapterId = queryParams.get("id");
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!chapterId) {
        return <h3 className="mb-0">Chapter ID not found</h3>;
    }
    return (
        <div className="ChapterCompleteComp position-relative mb-2">
            <div
                className="progress position-absolute top-0 start-0 rounded-0"
                style={{ height: 4, width: `calc(100% + 50px)`, marginLeft: -25, marginTop: -25 }}
                role="progressbar"
            >
                <div className="progress-bar bg-theme-1 rounded-end" style={{ width: `${100}%` }}></div>
            </div>
            <div className="ChapterCompleteComp-inner-wrapper p-4">
                <div style={{ maxWidth: "800px" }} className="ChapterCompleteComp-inner text-center theme-shadow-1 rounded overflow-hidden p-4 pb-5">
                    <h3 className="chapter-name fw-500 text-secondary mb-3">{chapterName}</h3>
                    <h3 className="chapter-desc fs-6 fw-normal">{chapterDesc}</h3>
                    <img src={chapterCompleteImg} alt="Chapter Complete" className="img-fluid my-4" />
                    <h2 className="title text-theme-1 fs-3 fw-bold fw-500 mb-3 lang-switchable" dangerouslySetInnerHTML={{ __html: t("chapters.congrats").replace(/\n/g, "<br />") }}></h2>
                    <p className="mb-0 text-dark fw-500 lang-switchable mb-2"> {t("chapters.congrats_desc")}</p>
                    <RippleButton
                        onClickHandler={() => {
                            navigate(`/quiz-paper?id=${chapterId}`);
                        }}
                        rippleDelay={200}
                        className="btn px-5 py-2 mt-3 text-light btn-theme-1 rounded-pill lang-switchable"
                    >
                        <b className="d-inline-block fw-500 px-5 mx-5">{t("chapters.learn_quiz")}</b>
                    </RippleButton>
                </div>
            </div>
        </div>
    );
};

export default ChapterCompleteComp;
