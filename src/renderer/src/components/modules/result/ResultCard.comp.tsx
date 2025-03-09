import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ResultCardComp = ({ data }) => {
    const { t } = useTranslation();
    if (!data?.name) return null;

    return (
        <div className="result-component-card card-widget p-3">
            <div className="d-flex align-items-center mb-1">
                <div className="col-auto w-75">
                    <p className="chapter-number text-dark fw-bold mb-2">{data?.name}</p>
                    <p className="chapter-title text-break">{data?.desc}</p>
                </div>
                <div className="col-auto flex-grow-1 text-end">
                    <p className="chapter-number fw-bold small text-secondary mb-2">Total Points:</p>
                    <h3 className={`point fs-2 fw-bold text-${data?.success_rate >= 80 ? "theme-1" : "danger"}`}>
                        {data?.total_points}/{data?.total_quiz}
                    </h3>
                </div>
            </div>
            <div className="progress mb-3" style={{ height: 5 }} role="progressbar">
                <div className="progress-bar bg-theme-1" style={{ width: `${data?.success_rate}%` }}></div>
            </div>
            <div className="card-actions d-flex align-items-center lang-switchable">
                <Link to={`/answer-paper?id=${data?.chapter_id}`} type="button" className="btn btn-start btn-sm">
                    {t("quiz.view_answer")}
                </Link>
                <Link to={`/quiz-paper?id=${data?.chapter_id}`} type="button" className="btn bg-danger bg-opacity-10 text-danger btn-sm ms-auto">
                    {t("quiz.retake_quiz")}
                </Link>
            </div>
        </div>
    );
};

export default ResultCardComp;
