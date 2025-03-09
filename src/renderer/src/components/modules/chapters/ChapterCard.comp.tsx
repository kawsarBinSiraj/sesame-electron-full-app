import { convertUnit8ArrayToBlob } from "@renderer/utlis";
import { Link } from "react-router-dom";
import { formatNumber } from "@renderer/utlis";
import { useTranslation } from "react-i18next";

const ChapterCard = ({ data }) => {
    const { t } = useTranslation();
    
    if (!data?.name) return null;
    return (
        <div data-chapter-id={data?.id} style={{ padding: 12 }}  className="card-widget card border-0 h-100">
            <Link to={`/chapter-docs?id=${data?.id}`} className="d-block text-decoration-none card-img-wrapper position-relative mb-2">
                <div className="card-img-block border border-secondary border-opacity-10">
                    <img src={data?.thumb ? convertUnit8ArrayToBlob(data?.thumb) : ""} alt="Card Img" className="card-img img-fluid w-100" />
                </div>
                <span className="playIcon position-absolute top-0 end-0  bg-white rounded-circle">
                    <svg width="12" height="14" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.0302 6.27247C13.3667 7.03678 13.3746 8.96126 12.0444 9.73655L3.05997 14.9732C1.72981 15.7484 0.0591983 14.7931 0.0528606 13.2535L0.0100527 2.85439C0.00371493 1.3148 1.66641 0.3457 3.0029 1.11001L12.0302 6.27247Z"
                            fill="#00B140"
                        />
                    </svg>
                </span>
            </Link>
            <p className="title mb-2">{data?.name}</p>
            <p className="content mb-2">{data?.desc}</p>
            <div className="progress-wrapper mb-3">
                <div className="progress-text mb-2 d-flex align-items-center">
                    <span className="aria-start-value">0%</span>
                    <span className="aria-current-value ms-auto">{formatNumber(data?.progress ?? 0)}%</span>
                </div>
                <div className="progress" style={{ height: 5 }} role="progressbar">
                    <div className="progress-bar bg-theme-1" style={{ width: `${data?.progress ?? 0}%` }}></div>
                </div>
            </div>
            <div className="card-actions d-flex align-items-center lang-switchable">
                {Number(data?.progress) >= 100 ? (
                    <Link to={`/quiz-paper?id=${data?.id}`} type="button" className="btn btn-default btn-sm">
                        {t("chapters.quiz")}
                    </Link>
                ) : null}

                <Link to={`/chapter-docs?id=${data?.id}`} type="button" className="btn btn-start btn-sm ms-auto">
                    {data?.progress > 0 ? <>{t("chapters.resume")}</> : <>{t("chapters.get_started")}</>}
                </Link>
            </div>
        </div>
    );
};

export default ChapterCard;
