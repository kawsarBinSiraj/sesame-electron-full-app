import React, { useState, useEffect } from "react";
import ResultCardComp from "./ResultCard.comp";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ResultComp = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isApplicableForCertificate, setIsApplicableForCertificate] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const getAllChaptersWithQuizPoints = async () => {
            try {
                setLoading(true);
                const { ipcRenderer } = window.Electron;
                const data = await ipcRenderer.invoke("get-chapters-quiz-points");
                if (data?.length) {
                    const { results, newData } = data.reduce(
                        (accumulator, r) => {
                            const totalPoints = r.total_points;
                            const totalQuiz = JSON.parse(r.quizzes)?.quizzes.length ?? 0;
                            const success_rate = Number((totalPoints / totalQuiz) * 100).toFixed(2);
                            const result = {
                                ...r,
                                success_rate: Number(success_rate),
                                total_quiz: totalQuiz,
                            };
                            accumulator.newData.push(result);
                            if (totalPoints != null) accumulator.results.push(result);
                            return accumulator;
                        },
                        { results: [], newData: [] }
                    );
                    const isApplicable = newData.every((r) => Number(r.success_rate) >= 80);
                    setIsApplicableForCertificate(isApplicable);
                    setShowAlert(isApplicable);
                    setResults(results);
                }
            } catch (error) {
                if (process.env.NODE_ENV === "development") console.error(error);
            } finally {
                setTimeout(() => setLoading(false), 100);
            }
        };
        getAllChaptersWithQuizPoints();
    }, []);

    return (
        <div className="ResultComp">
            {loading ? (
                <>
                    <header className="mb-4 d-flex align-items-center">
                        <div className="header-head">
                            <h2 className="page-title fs-2 fw-bold text-theme-1 lang-switchable mb-0"> {t("quiz.my_result")}</h2>
                        </div>
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
                    <header className="mb-4 d-flex align-items-center">
                        <div className="header-head">
                            <h2 className="page-title fs-2 fw-bold text-theme-1 lang-switchable mb-0"> {t("quiz.my_result")}</h2>
                            {!results?.length && <p className="mb-0 lang-switchable mt-3">{t("quiz.have_finish_quiz")}</p>}
                        </div>
                    </header>

                    {isApplicableForCertificate && showAlert ? (
                        <div className="alert alert-success position-relative py-2 mb-4 lang-switchable" role="alert">
                            <p className="fs-6 d-flex align-items-center gap-2 mb-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-info-circle-fill text-theme-1"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                </svg>
                                {t("quiz.eligible")}
                                <Link to={"/certificate"} type="button" className="btn ms-2 py-0 btn-sm bg-theme-1 text-light rounded-pill px-2">
                                    <small>{t("quiz.collect")}</small>
                                </Link>
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                role="button"
                                fill="currentColor"
                                className="text-danger position-absolute"
                                style={{ top: -8, right: -8 }}
                                viewBox="0 0 16 16"
                                onClick={() => setShowAlert(false)}
                            >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                        </div>
                    ) : null}

                    <div className="row">
                        {results?.length
                            ? results.map((result, i) => {
                                  return (
                                      <div key={i} className="col-xxl-4 col-md-6">
                                          <ResultCardComp data={{ ...result, index: i }} />
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                </>
            )}
        </div>
    );
};

export default ResultComp;
