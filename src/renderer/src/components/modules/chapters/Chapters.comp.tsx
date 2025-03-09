import { useState, useEffect } from "react";
import OverAllProgressCardComp from "../OverAllProgressCard.comp";
import ChapterCard from "./ChapterCard.comp";
import { useTranslation } from "react-i18next";
import useLoggedUser from "@renderer/hooks/useLoggedUser";
import DashImg from "@renderer/assets/images/dash-1.png";

const ChaptersComp = () => {
    const [chapters, setChapters] = useState([]);
    const [overallProgress, setOverallProgress] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const loggedUser = useLoggedUser();

    /**
     * Calculates the overall progress based on the chapters array
     * @param {Object[]} data - The array of chapters
     * @returns {number} - The overall progress in percentage
     */
    interface Chapter {
        progress?: number;
    }

    const calculateOverallProgress = (data: Chapter[]): void => {
        const totalChapters = data?.length;
        if (totalChapters === 0) return; // Avoid division by zero
        // Calculate the total progress of all chapters
        const totalChapterProgress = data.reduce((total, chapter) => total + (chapter?.progress ?? 0), 0);
        // Calculate the overall progress as a percentage
        const overallProgress = Number(totalChapterProgress / totalChapters).toFixed(2);
        // return the overall progress
        setOverallProgress(Number(overallProgress));
    };

    /**
     * @desc :- getAllChapters from backend
     * created_by :- Kawsar Bin Siraj (08/02/2025)
     */
    const getAllChapters = async (userId: number) => {
        try {
            setLoading(true);
            const { ipcRenderer } = window.Electron;
            const data = await ipcRenderer.invoke("get-chapters", { userId });
            setChapters(data ?? []);
            calculateOverallProgress(data);
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.error(error);
        } finally {
            setTimeout(() => setLoading(false), 100);
        }
    };

    useEffect(() => {
        if (loggedUser?.id) {
            getAllChapters(Number(loggedUser?.id));
        }
    }, [loggedUser]);

    return (
        <div className="ChaptersComp">
            <div className="row mb-4">
                <div className="col-6 col-xl-7 col-xxl-8">
                    <div className="DashImg-wrapper rounded overflow-hidden h-100">
                        <img src={DashImg} alt="DashImg" className="DashImg h-100 img-fluid w-100" />
                    </div>
                </div>
                <div className="col-6 col-xl-5 col-xxl-4">
                    <OverAllProgressCardComp progress={overallProgress} loading={loading} />
                </div>
            </div>
            <h2 className="page-title fs-2 fw-bold lang-switchable mb-4 text-theme-1">{t("chapters.chapters")}</h2>
            <div className="row gx-3">
                {loading ? (
                    <div className="d-flex align-items-center gap-2">
                        <div className="spinner-border  border-1 ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h2 className="mb-0">Loading</h2>
                    </div>
                ) : (
                    <>
                        {chapters.map((chapter, i) => {
                            return (
                                <div key={i} className="col-xxl-5-custom col-xl-3 col-md-4 col-sm-6 mb-3">
                                    <ChapterCard data={chapter} />
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChaptersComp;
