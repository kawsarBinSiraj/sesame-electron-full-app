import { convertUnit8ArrayToBlob } from "@renderer/utlis";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const QuizBoxComp = ({ data }) => {
    const { t } = useTranslation();

    if (!data?.name) return null;

    return (
        <div style={{ padding: 12 }} className="card-widget card border-0 h-100">
            <Link to={`/quiz-paper?id=${data?.chapter_id}`} className="d-block text-decoration-none card-img-wrapper position-relative mb-2">
                <div className="card-img-block border border-secondary border-opacity-10">
                    <img src={data?.thumb ? convertUnit8ArrayToBlob(data?.thumb) : ""} alt="Card Img" className="card-img img-fluid w-100" />
                </div>
            </Link>
            <p className="title mb-2 d-flex align-items-center gap-1">
                <span className="name flex-grow-1">{data?.name}</span>
                <span className="total-quiz opacity-50 fw-light ms-auto">{JSON.parse(data?.quizzes)?.quizzes?.length} Questions</span>
            </p>
            <p className="content mb-2">{data?.desc}</p>
            <div className="card-actions d-flex align-items-center lang-switchable">
                {data?.success_rate != null ? (
                    <>
                        <Link to={`/answer-paper?id=${data?.chapter_id}`} type="button" className="btn flex-shrink-0 btn-start btn-sm">
                            {t("quiz.view_answer")}
                        </Link>
                        <Link to={`/quiz-paper?id=${data?.chapter_id}`} type="button" className="btn bg-danger bg-opacity-10 text-danger btn-sm ms-auto">
                            {t("quiz.retake_quiz")}
                        </Link>
                    </>
                ) : (
                    <Link to={`/quiz-paper?id=${data?.chapter_id}`} type="button" className="btn btn-start btn-sm ms-auto">
                        {t("quiz.start_quiz")}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default QuizBoxComp;
