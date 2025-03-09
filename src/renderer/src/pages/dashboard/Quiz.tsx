import DashboardComp from "@renderer/components/layout/Dashboard.comp";

const Quiz = () => {
    return (
        <div id="quiz-page">
            <DashboardComp context="quizzes" />
        </div>
    );
};

export default Quiz;
