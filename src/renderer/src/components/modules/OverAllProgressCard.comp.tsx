import { useEffect, useState } from "react";
import { formatNumber } from "@renderer/utlis";
import useLoggedUser from "@renderer/hooks/useLoggedUser";
import { useTranslation } from "react-i18next";

const OverAllProgressCardComp = ({ progress = 0, loading = false }) => {
    interface LastSeen {
        desc?: string;
        progress?: number;
    }

    const [lastSeen, setLastSeen] = useState<LastSeen | null>({});
    const { t } = useTranslation();
    const loggedUser = useLoggedUser();

    /**
     * @desc :- set last seen
     * created_by :- Kawsar Bin Siraj (20/02/2025)
     */
    useEffect(() => {
        const getLastSeenData = async (userId: number) => {
            try {
                const { ipcRenderer } = window.Electron;
                const lastSeenData = await ipcRenderer.invoke("get-last-seen-data", { userId });
                setLastSeen(lastSeenData);
            } catch (error) {
                if (process.env.NODE_ENV === "development") console.error(error);
            }
        };
        if (loggedUser?.id) {
            getLastSeenData(Number(loggedUser?.id));
        }
    }, [loggedUser]);

    return (
        <div className="OverAllProgressCardComp h-100 p-2">
            <div className="card-widget h-100 card shadow-none p-3 border-0">
                <div className="overall-content d-flex algin-items-center border-bottom pb-3 mb-3">
                    <h4 className="overall-title lang-switchable mb-0 fs-4">{t("overall.overall")}</h4>
                    <h4 className="overall-progress-count ms-auto text-theme-1 fw-bold mb-0">
                        {loading ? (
                            <div className="spinner-border  border-1" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <span className="aria-current-value">{formatNumber(progress ?? 0)}%</span>
                        )}
                    </h4>
                </div>
                {lastSeen?.progress ? (
                    <>
                        <p className="title fs-6 text-theme-1 lang-switchable mb-3">{t("overall.last_seen")}</p>
                        <p className="content fs-6 lh-base mb-2">{lastSeen?.desc}</p>
                        <div className="progress-wrapper mb-3">
                            <div className="progress-text mb-2 d-flex align-items-center">
                                <span className="aria-start-value">0%</span>
                                <span className="aria-current-value ms-auto">{formatNumber(lastSeen?.progress ?? 0)}%</span>
                            </div>
                            <div className="progress" style={{ height: 5 }} role="progressbar">
                                <div className="progress-bar bg-theme-1" style={{ width: `${lastSeen?.progress ?? 0}%` }}></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p
                            className="default-title lang-switchable h-100 d-flex py-4 align-items-center justify-content-center fs-6 text-center lh-base mb-2"
                            dangerouslySetInnerHTML={{ __html: t("overall.start").replace(/\n/g, "<br />") }}
                        ></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default OverAllProgressCardComp;
