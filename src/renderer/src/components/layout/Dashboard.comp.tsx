import ChaptersComp from "@renderer/components/modules/chapters/Chapters.comp";
import ChapterDocsComp from "@renderer/components/modules/chapters/ChapterDocsView.comp";
import ChapterCompleteComp from "@renderer/components/modules/chapters/ChapterComplete.comp";
import Sidebar from "@renderer/components/layout/Sidebar.comp";
import BreadcrumbsComp from "../modules/Breadcrumbs.comp";
import AboutComp from "../modules/About.comp";
import QuizPaperComp from "../modules/quiz/QuizPaper.comp";
import AnswerPaperComp from "../modules/result/AnswerPaper.comp";
import QuizzesComp from "../modules/quiz/Quizzes.comp";
import ResultComp from "../modules/result/Result.comp";
import CertificateComp from "../modules/certificate/Certificate.comp";
import ProfileComp from "../modules/Profile.comp";

const DashboardComp = ({ context = "chapters" }) => {
    /**
     * @desc :- wrappingWithContext
     * created_by :- Kawsar Bin Siraj (06/02/2025)
     */
    const wrappingWithContext = (context: string) => {
        switch (context) {
            case "chapters":
                return <ChaptersComp />;
            case "chapter-docs":
                return <ChapterDocsComp />;
            case "chapter-complete":
                return <ChapterCompleteComp />;
            case "about":
                return <AboutComp />;
            case "quizzes":
                return <QuizzesComp />;
            case "quiz-paper":
                return <QuizPaperComp />;
            case "answer-paper":
                return <AnswerPaperComp />;
            case "result":
                return <ResultComp />;
            case "certificate":
                return <CertificateComp />;
            case "profile":
                return <ProfileComp />;
            default:
                return <ChaptersComp />;
        }
    };

    return (
        <div className="DashboardComp-layout">
            <div className="container-fluid">
                <div className="dashboard-grid-row">
                    <div className="grid-col height-full border-end">
                        <Sidebar />
                    </div>
                    <div className="grid-col height-full">
                        <BreadcrumbsComp />
                        <div className="app-content mt-4">{wrappingWithContext(context)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardComp;
