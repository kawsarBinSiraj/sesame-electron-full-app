import { useEffect, useState } from "react";
import PdfGenerator from "./PdfGenerator.comp";
import NotApplicableForCertificate from "./NotApplicableForCertificate.comp";
import { useTranslation } from "react-i18next";

const CertificateComp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isApplicableForCertificate, setIsApplicableForCertificate] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        const getAllChaptersWithQuizPoints = async () => {
            try {
                setLoading(true);
                const { ipcRenderer } = window.Electron;
                const data = await ipcRenderer.invoke("get-chapters-quiz-points");
                if (data?.length) {
                    const newData = data.reduce((acc: any, r: any) => {
                        const totalPoints = r.total_points;
                        const totalQuiz = JSON.parse(r.quizzes)?.quizzes.length ?? 0;
                        const success_rate = Number((totalPoints / totalQuiz) * 100).toFixed(2);
                        const result = {
                            ...r,
                            success_rate: Number(success_rate),
                            total_quiz: totalQuiz,
                        };
                        acc.push(result);
                        return acc;
                    }, []);
                    const isApplicable = newData.every((r: any) => Number(r.success_rate) >= 80);
                    setIsApplicableForCertificate(isApplicable);
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
        <div className="CertificateComp pb-4">
            {loading ? (
                <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border  border-1 ms-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h2 className="mb-0">Loading</h2>
                </div>
            ) : (
                <>
                    {isApplicableForCertificate ? (
                        <>
                            <h2 className="page-title fs-2 fw-bold text-theme-1 lang-switchable mb-0">{t("certificate.my_certificate")}</h2>
                            <PdfGenerator />
                        </>
                    ) : (
                        <>
                            <NotApplicableForCertificate />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default CertificateComp;
