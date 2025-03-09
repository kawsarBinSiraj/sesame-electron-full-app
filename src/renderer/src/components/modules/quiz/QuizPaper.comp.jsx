import { useState, useEffect } from "react";
import QuizCardComp from "./QuizCard.comp";
import { useLocation, useNavigate } from "react-router-dom";
import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useTranslation } from "react-i18next";

const QuizPaperComp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const chapterId = queryParams.get("id");
    const [loading, setLoading] = useState(null);
    const [submitting, setSubmitting] = useState(null);
    const [chapterInfo, setChapterInfo] = useState({});
    const [chapterQuizzes, setChapterQuizzes] = useState([]);
    const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
    const { t } = useTranslation();

    /**
     * @desc :- shuffle quiz data
     * created_by :- Kawsar Bin Siraj (23/02/2025)
     */
    const shuffleQuizData = (quizData) => {
        // Fisher-Yates Shuffle Algorithm
        function shuffleArray(array) {
            const shuffled = [...array]; // Clone array to avoid mutation
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        // Shuffle the questions first
        const shuffledQuestions = shuffleArray(quizData).map((question, i) => ({
            ...question,
            index: i, // Assign a new sequential index after shuffling
            options: shuffleArray([...question.options]), // Ensure options are also shuffled
        }));

        return shuffledQuestions;
    };

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
                const response = await ipcRenderer.invoke("get-single-chapter", { chapterId });
                const { content, ...data } = response;
                const quizzes = JSON.parse(data?.quizzes)?.quizzes;
                const shuffledQuizzes = shuffleQuizData(quizzes);
                setChapterQuizzes(shuffledQuizzes);
                setChapterInfo(data);
            } catch (error) {
                if (process.env.NODE_ENV === "development") console.error(error);
            } finally {
                // Set loading to false after 100ms
                setTimeout(() => setLoading(false), 100);
            }
        };
        getChapterInfo(chapterId);
    }, [chapterId]);

    /**
     * Handles the quiz attempt logic.
     * @desc :- This function is triggered when a user attempts a quiz.
     */
    const onQuizAttempt = (data, answer) => {
        if (!answer) return;
        setAttemptedQuizzes((prev) => {
            // Check if data.id already exists in prev
            const exists = prev.some((quiz) => quiz.id === data.id);
            const isCorrect = data.correct_answer === answer;
            const point = isCorrect ? data.point : 0;

            if (exists) {
                // Update only isCorrect for the matching item
                return prev.map((quiz) => (quiz.id === data.id ? { ...quiz, isCorrect, answer, point } : quiz));
            } else {
                // Add new object if data.id is not in prev
                return [...prev, { ...data, isCorrect, answer, point }];
            }
        });
    };

    /**¸
     * @desc :- Handles the quiz submission logic.
     * This function is triggered when a user submits a quiz.
     * @param {Object} attemptedQuizzes - The quizzes that the user has attempted
     * @param {string} chapterId - The chapter id
     */
    const onSubmit = async () => {
        try {
            setSubmitting(true);
            if (!chapterId) throw new Error("chapterId is required");
            // Step 1: Filter chapterQuizzes by removing attempted ones
            const filteredQuizzes = chapterQuizzes.filter((quiz) => !attemptedQuizzes.some((attempt) => attempt.id === quiz.id));
            // Step 2: Modify the filtered quizzes (adding a new property, e.g., `status: "isCorrect"`)
            const modifiedFilteredQuizzes = filteredQuizzes.map((quiz) => ({ ...quiz, isCorrect: false, answer: "", point: 0 }));
            // Step 3: Merge attemptedQuizzes and modifiedFilteredQuizzes
            const mergedQuizzes = [...attemptedQuizzes, ...modifiedFilteredQuizzes];
            // step 4: Save to db
            const quizzesData = mergedQuizzes.map((quiz) => ({
                chapter_id: parseInt(chapterId),
                answer: quiz?.answer,
                point: parseInt(quiz.point),
                quiz_id: parseInt(quiz.id),
                quiz_index: parseInt(quiz.index),
                quiz: JSON.stringify(quiz),
            }));
            const sortedQuizzesData = quizzesData.sort((a, b) => a.quiz_index - b.quiz_index);
            const currentTotalPoints = sortedQuizzesData.reduce((acc, curr) => acc + curr.point, 0);

            const { ipcRenderer } = window.Electron;
            const response = await ipcRenderer.invoke("get-single-chapter-quiz-points", { chapterId });
            const alreadyTotalPoints = response?.length ? response?.reduce((acc, cur) => acc + cur?.point, 0) : 0;

            if (Number(currentTotalPoints) < parseInt(alreadyTotalPoints)) navigate("/result");
            else {
                const res = await ipcRenderer.invoke("upsert-quiz-answer", { data: sortedQuizzesData });
                if (res) navigate("/result");
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.error(error);
        } finally {
            setTimeout(() => setSubmitting(false), 300);
        }
    };

    return (
        <div className="QuizComp pb-4">
            <header className="mb-4">
                <div className="title d-flex align-items-center gap-3 mb-3">
                    <h2 className="page-title fs-2 fw-bold text-theme-1 lang-switchable mb-0">{t("chapters.quiz")}</h2>
                    <h4 className="total-quiz lang-switchable mb-0 ms-auto">
                        {t("quiz.total_quiz_question")}: <span className="fw-bold text-theme-1">{chapterQuizzes?.length ?? 0}</span>
                    </h4>
                </div>
                <p className="chapter-title mb-0">
                    <span className="chapter-name">
                        <span className="fw-normal">{chapterInfo?.name}</span>
                        <span className="mx-1 d-inline-block">:</span>
                        <span className="fw-normal">{chapterInfo?.desc}</span>
                    </span>
                </p>
            </header>
            {Array.isArray(chapterQuizzes) && chapterQuizzes?.length ? (
                <>
                    {chapterQuizzes.map((quiz, i) => {
                        return (
                            <div key={i} className="QuizCardComp-wrapper mb-3">
                                <QuizCardComp data={{ ...quiz, index: i }} callback={onQuizAttempt} />
                            </div>
                        );
                    })}
                    <div className="form-group py-2 text-end">
                        <button type="button" disabled={submitting || !attemptedQuizzes?.length} className="btn p-0 border-0">
                            <RippleButton
                                onClickHandler={() => onSubmit()}
                                className="btn px-5 btn-signup d-inline-flex align-items-center justify-content-center text-light btn-theme-1 rounded-pill"
                            >
                                <small className="px-5 fs-6 d-block lang-switchable">
                                    {t("quiz.submit")}
                                    {submitting ? (
                                        <div className="spinner-border spinner-border-sm border-1 ms-2" role="status">
                                            <span className="visually-hidden">Processing...</span>
                                        </div>
                                    ) : null}
                                </small>
                            </RippleButton>
                        </button>
                    </div>
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

export default QuizPaperComp;
