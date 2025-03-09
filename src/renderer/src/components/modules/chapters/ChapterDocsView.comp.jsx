import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Controller } from "swiper/modules";
import RippleButton from "@renderer/components/modules/RippleButton.comp";
import { useTranslation } from "react-i18next";
import "swiper/css"; // Base styles
import "swiper/css/navigation"; // Optional
import "swiper/css/pagination"; // Optional

const ChapterDocsComp = () => {
    const { t } = useTranslation();
    const thumbSwiperRef = useRef(null);
    const [mainSwiper, setMainSwiper] = useState(null);
    const [thumbSwiper, setThumbSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [chapterInfo, setChapterInfo] = useState({});
    const [updatedChapterProgress, setUpdatedChapterProgress] = useState({});
    const [chapterSlides, setChapterSlides] = useState([]);
    const [loading, setLoading] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const chapterId = queryParams.get("id");
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    /**
     * @desc :- set chapter info before quite component
     * created_by :- Kawsar Bin Siraj (20/02/2025)
     */
    const saveLastSeenData = async (data) => {
        try {
            const { ipcRenderer } = window.Electron;
            if (!data?.desc || !data?.progress || !chapterId) {
                console.warn("Missing required data:", { desc: data?.desc, progress: data?.progress, chapter_id: chapterId });
                return;
            }

            const values = { desc: data.desc, progress: data.progress, chapter_id: chapterId };
            await ipcRenderer.invoke("save-last-seen-data", values);
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.error(error);
        }
    };
    useEffect(() => {
        return () => {
            const merged = { ...chapterInfo, ...updatedChapterProgress };
            saveLastSeenData(merged);
        };
    }, [updatedChapterProgress, chapterInfo]);

    /**
     * @desc :- mainSwiper and thumbSwiper sync
     * created_by :- Kawsar Bin Siraj (17/02/2025)
     */
    useEffect(() => {
        if (mainSwiper?.controller && thumbSwiper?.controller) {
            mainSwiper.controller.control = thumbSwiper;
            thumbSwiper.controller.control = mainSwiper;
        }
    }, [mainSwiper, thumbSwiper]);

    /**
     * @desc :- get chapter info from IPC
     * created_by :- Kawsar Bin Siraj (09/02/2025)
     * @param {string} chapterId
     */
    useEffect(() => {
        const getChapterInfo = async (chapterId) => {
            try {
                setLoading(true);
                const { ipcRenderer } = window.Electron;
                const response = await ipcRenderer.invoke("get-single-chapter", { chapterId });
                const { content, ...rest } = response;
                setChapterInfo(rest);

                const chapterSlides = JSON.parse(response.content);
                if (chapterSlides?.length) {
                    const slides = chapterSlides.map((slide) => {
                        // Create a blob from the image data
                        const blob = new Blob([new Uint8Array(slide?.data)], { type: "image/jpeg" });
                        // Create a blob URL from the blob
                        const blobUrl = URL.createObjectURL(blob);
                        // Return the slide data with the blob URL
                        return { ...slide, blobUrl };
                    });
                    setChapterSlides(slides);
                } else setChapterSlides([]);

                const chapterCurrentProgress = rest?.progress;
                const chapterQuizPoints = rest?.total_points;

                if (chapterCurrentProgress >= 100 && chapterQuizPoints != null) {
                    setActiveIndex(0);
                } else {
                    if (chapterCurrentProgress !== null && chapterSlides?.length) {
                        const totalSlides = chapterSlides?.length;
                        const progress = rest?.progress;
                        const calculatedIndex = Math.round((progress / 100) * totalSlides) - 1;
                        setActiveIndex(calculatedIndex);
                    }
                }
                // by default set existing progress
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
     * @desc :- update chapter progress
     * created_by :- Kawsar Bin Siraj (17/02/2025)
     * @param {number} progress
     */
    const updateChapterProgress = async (id, progress) => {
        try {
            const { ipcRenderer } = window.Electron;
            // Get the chapter info from the IPC
            const response = await ipcRenderer.invoke("update-chapter-progress", { id, progress });
            setUpdatedChapterProgress(response?.[0] ?? {});
        } catch (error) {
            if (process.env.NODE_ENV === "development") console.error(error);
        }
    };

    useEffect(() => {
        if (progress) updateChapterProgress(chapterId, progress);
    }, [progress, chapterId]);

    /**
     * @desc :- handelCurrentSlideWithProgress
     * created_by :- Kawsar Bin Siraj (24/02/2025)
     */
    const handelCurrentSlide = (swiper) => {
        const totalSlides = swiper.slides.length;
        if (!totalSlides) return;
        const currentIndex = swiper.activeIndex;
        const currentSlide = currentIndex + 1;
        const progress = Number(((currentSlide || 0) / totalSlides) * 100).toFixed(2);
        setActiveIndex(currentIndex);
        setProgress(progress);
    };

    return (
        <div className="ChapterDocsComp position-relative mb-2">
            <div id="swiper-slides">
                {loading ? (
                    <h3 className="mb-0 fw-normal d-flex align-items-center">
                        <div className="spinner-border border-1 me-2" role="status">
                            <span className="visually-hidden">Processing...</span>
                        </div>
                        Processing chapter data
                    </h3>
                ) : (
                    <div id="swiper-sync">
                        <div
                            className="progress position-absolute top-0 start-0 rounded-0"
                            style={{ height: 4, width: `calc(100% + 50px)`, marginLeft: -25, marginTop: -22 }}
                            role="progressbar"
                        >
                            <div className="progress-bar bg-theme-1 rounded-end" style={{ width: `${progress}%` }}></div>
                        </div>

                        <header className="chapter-header position-relative" style={{ marginRight: "5%" }}>
                            <p style={{ marginTop: -5 }} className="chapter-title text-capitalize d-flex align-items-center fs-6 mb-3">
                                <span className="chapter-name">
                                    <span className="fw-bold">{chapterInfo?.name}:</span>
                                    <span className="fw-normal">{chapterInfo?.desc}</span>
                                </span>
                                <span className="chapter-slide-viewed fw-bold ms-auto">
                                    <span className={`opacity-${progress >= 100 ? "0" : "1"}`}>
                                        {activeIndex + 1}/{chapterSlides?.length}
                                    </span>
                                    {progress >= 100 ? (
                                        <span className="position-absolute end-0" style={{ top: -10 }}>
                                            <RippleButton
                                                onClickHandler={() => {
                                                    navigate(`/chapter-complete?name=${chapterInfo?.name}&desc=${chapterInfo?.desc}&id=${chapterInfo?.id}`);
                                                }}
                                                rippleDelay={200}
                                                className="btn px-4 py-2 text-light btn-theme-1 rounded-pill"
                                            >
                                                <b className="d-inline-block fw-normal lang-switchable px-2">{t("chapters.next")}</b>
                                            </RippleButton>
                                        </span>
                                    ) : null}
                                </span>
                            </p>
                        </header>

                        {/* Main Swiper */}
                        <div id="main-swiper" className="ps-2">
                            <Swiper
                                modules={[Controller, Thumbs, Navigation]}
                                slidesPerView={1}
                                onSwiper={setMainSwiper}
                                navigation={true}
                                onSlideChange={(swiper) => {
                                    handelCurrentSlide(swiper);
                                }}
                                onInit={(swiper) => {
                                    handelCurrentSlide(swiper);
                                }}
                                initialSlide={activeIndex}
                            >
                                {chapterSlides.map((data, index) => {
                                    return (
                                        <SwiperSlide data-slide-number={index + 1} key={index}>
                                            <div className="mainSwiper-slide">
                                                <img src={data?.blobUrl} alt={"chapter-img"} className="img-fluid w-100" />
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                        {/* Thumbnail Swiper */}
                        <div id="thump-swiper">
                            <button
                                type="button"
                                disabled={activeIndex === 0}
                                className="btn btn-swiper-navigate btn-swiper-prev"
                                onClick={() => thumbSwiperRef.current?.slidePrev()}
                            >
                                <svg width="10" height="16" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.84658 18.4035L0.312106 10.0735C0.107623 9.869 0 9.62147 0 9.35241C0 9.07259 0.118385 8.80354 0.322868 8.63134L8.84658 0.290581C9.02954 0.107623 9.26631 0 9.54613 0C10.1058 0 10.5255 0.430491 10.5255 0.990129C10.5255 1.24842 10.4179 1.50672 10.2457 1.68968L2.41075 9.35241L10.2457 17.0151C10.4179 17.1981 10.5255 17.4456 10.5255 17.7147C10.5255 18.2743 10.1058 18.6941 9.54613 18.6941C9.26631 18.6941 9.02954 18.5864 8.84658 18.4035Z"
                                        fill="#00B140"
                                    />
                                </svg>
                            </button>
                            <Swiper
                                modules={[Controller]}
                                className="mt-2 p-2"
                                spaceBetween={0}
                                slidesPerView={3.5}
                                watchSlidesProgress={true}
                                centeredSlides={false}
                                onSwiper={(swiper) => {
                                    setThumbSwiper(swiper);
                                    thumbSwiperRef.current = swiper;
                                }}
                                allowTouchMove={false}
                                initialSlide={activeIndex}
                            >
                                {chapterSlides.map((data, index) => {
                                    const latestLastProgress = updatedChapterProgress?.progress || chapterInfo?.progress;
                                    const isClickable = latestLastProgress < 100 ? index <= activeIndex + 1 : true;

                                    return (
                                        <SwiperSlide data-slide-number={index + 1} key={index}>
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (isClickable) mainSwiper.slideTo(index);
                                                }}
                                                className={`thumbSwiper-slide ${isClickable ? "cursor-pointer" : ""} ${index === activeIndex ? "active" : ""}`}
                                            >
                                                <img src={data?.blobUrl} alt={"chapter-img"} className="img-fluid w-100" />
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <button
                                type="button"
                                disabled={activeIndex === chapterSlides?.length - 1}
                                className="btn btn-swiper-navigate btn-swiper-next"
                                onClick={() => thumbSwiperRef.current?.slideNext()}
                            >
                                <svg width="10" height="16" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.67881 18.4035L10.2133 10.0735C10.4178 9.869 10.5254 9.62147 10.5254 9.35241C10.5254 9.07259 10.407 8.80354 10.2025 8.63134L1.67881 0.290581C1.49585 0.107623 1.25908 0 0.979259 0C0.419621 0 -0.000107765 0.430491 -0.000107765 0.990129C-0.000107765 1.24842 0.107514 1.50672 0.279711 1.68968L8.11464 9.35241L0.279711 17.0151C0.107514 17.1981 -0.000107765 17.4456 -0.000107765 17.7147C-0.000107765 18.2743 0.419621 18.6941 0.979259 18.6941C1.25908 18.6941 1.49585 18.5864 1.67881 18.4035Z"
                                        fill="#00B140"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChapterDocsComp;
