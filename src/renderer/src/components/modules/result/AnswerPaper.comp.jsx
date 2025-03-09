import { useState, useEffect } from "react";
import QuizCardForView from "./QuizCardForView.comp";
import { useLocation } from "react-router-dom";

const AnswerPaperComp = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const chapterId = queryParams.get("id");
    const [loading, setLoading] = useState(null);
    const [chapterInfo, setChapterInfo] = useState({});
    const [chapterQuizzes, setChapterQuizzes] = useState([]);

    /**
     * @desc :- get chapter info from IPC
     * created_by :- Kawsar Bin Siraj (09/02/2025)
     * @param {string} chapterId
     */
    useEffect(() => {
        const getChapterInfo = async (chapterId) => {
            if (!chapterId) return;
            try {
                setLoading(true);
                const { ipcRenderer } = window.Electron;
                const response = await ipcRenderer.invoke("get-single-chapter-quiz-points", { chapterId });
                if (response?.length) {
                    const total_points = response?.reduce((acc, cur) => acc + cur?.point, 0);
                    setChapterInfo({ total_points });
                    setChapterQuizzes(response);
                }
            } catch (error) {
                if (process.env.NODE_ENV === "development") console.error(error);
            } finally {
                // Set loading to false after 100ms
                setTimeout(() => setLoading(false), 100);
            }
        };

        getChapterInfo(chapterId);
    }, [chapterId]);

    return (
        <div className="AnswerPaperComp">
            <header className="mb-4">
                <div className="title d-flex align-items-center gap-3 mb-3">
                    <h2 className="page-title fs-2 fw-bold text-theme-1 mb-0">View Answer</h2>
                    <h4 className="total-quiz mb-0 ms-auto">
                        Total point:{" "}
                        <span className="fw-bold text-theme-1">
                            {chapterInfo?.total_points ?? 0}/{chapterQuizzes?.length ?? 0}
                        </span>
                    </h4>
                </div>
            </header>
            {Array.isArray(chapterQuizzes) && chapterQuizzes?.length ? (
                <>
                    {chapterQuizzes.map((quiz, i) => {
                        return (
                            <div key={i} className="QuizCardComp-wrapper mb-3">
                                <QuizCardForView quiz={{ ...quiz, index: i }} />
                            </div>
                        );
                    })}
                </>
            ) : loading ? (
                <h3 className="mb-0 fw-normal d-flex align-items-center">
                    <div className="spinner-border border-1 me-2" role="status">
                        <span className="visually-hidden">Processing...</span>
                    </div>
                    Processing question paper
                </h3>
            ) : null}
        </div>
    );
};

export default AnswerPaperComp;
