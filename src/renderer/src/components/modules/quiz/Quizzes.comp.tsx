import { useState, useEffect } from "react";
import useLoggedUser from "@renderer/hooks/useLoggedUser";
import QuizBoxComp from "./QuizBox.comp";
import { useTranslation } from "react-i18next";

const QuizzesComp = () => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);
    const loggedUser = useLoggedUser();
    const { t } = useTranslation();

    /**
     * @desc :- getAllChapters from backend
     * created_by :- Kawsar Bin Siraj (08/02/2025)
     */
    const getAllChapters = async () => {
        try {
            setLoading(true);
            const { ipcRenderer } = window.Electron;
            const data = await ipcRenderer.invoke("get-chapters-quiz-points");
            if (data?.length) {
                const resultScheme = data.reduce((acc: any, r: any) => {
                    if (Number(r.progress) >= 100) {
                        const totalQuiz = JSON.parse(r.quizzes)?.quizzes.length ?? 0;
                        const totalPoints = r.total_points;
                        const success_rate = totalPoints != null ? Number((totalPoints / totalQuiz) * 100).toFixed(2) : null;
                        const result = {
                            ...r,
                            success_rate,
                            total_quiz: totalQuiz,
                        };
                        acc.push(result);
                    }
                    return acc;
                }, []);
                setChapters(resultScheme);
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.error(error);
        } finally {
            setTimeout(() => setLoading(false), 100);
        }
    };

    useEffect(() => {
        if (loggedUser?.id) {
            getAllChapters();
        }
    }, [loggedUser]);

    return (
        <div className="QuizzesComp">
            {loading ? (
                <>
                    <header className="mb-4">
                        <h2 className="page-title fs-2 fw-bold mb-3 lang-switchable text-theme-1">{t("chapters.quiz")}</h2>
                    </header>
                    <div className="d-flex align-items-center gap-2">
                        <div className="spinner-border  border-1 ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h2 className="mb-0">Loading</h2>
                    </div>
                </>
            ) : (
                <>
                    <header className="mb-4">
                        <h2 className="page-title fs-2 fw-bold mb-3 lang-switchable text-theme-1">{t("chapters.quiz")}</h2>
                        {chapters?.length ? (
                            <p className="mb-0 lang-switchable">{t("quiz.quiz_desc")}</p>
                        ) : (
                            <p className="mb-0">{t("quiz.have_finish")}</p>
                        )}
                    </header>
                    {chapters?.length ? (
                        <div className="row gx-3">
                            {chapters.map((chapter, i) => {
                                return (
                                    <div key={i} className="col-xxl-5-custom col-xl-3 col-md-4 col-sm-6 mb-3">
                                        <QuizBoxComp data={chapter} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
};

export default QuizzesComp;
