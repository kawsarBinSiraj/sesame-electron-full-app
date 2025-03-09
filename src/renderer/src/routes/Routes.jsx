import { useState, useEffect } from "react";
import { Routes as RRDRoutes, Route, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NavigateRoute from "./NavigateRoute";
import Chapters from "../pages/dashboard/Chapters";
import ChapterDocs from "../pages/dashboard/ChapterDocs";
import ChapterComplete from "../pages/dashboard/ChapterComplete";
import Quiz from "../pages/dashboard/Quiz";
import QuizPaper from "../pages/dashboard/QuizPaper";
import AnswerPaper from "../pages/dashboard/AnswerPaper";
import Result from "../pages/dashboard/Result";
import Certificate from "../pages/dashboard/Certificate";
import About from "../pages/dashboard/About";
import UserProfile from "../pages/dashboard/UserProfile";
import Error404 from "../pages/Error404";
import Signin from "../pages/auth/Signin";
import Signup from "../pages/auth/Signup";
import Intro from "../pages/auth/Intro";
import AddAnotherAccount from "../pages/auth/AddAnotherAccount";

const Routes = () => {
    /**
     * @desc :- This is a state to check if the user is authenticated or not.
     * created_by :- Kawsar Bin Siraj (30/01/2025)
     */
    const [isAuth, setIsAuth] = useState(!!JSON.parse(localStorage.getItem("loggedUser")));
    const navigate = useNavigate();
    const location = useLocation();

    //Add an effect to watch for token changes
    useEffect(() => {
        const handleStorageChange = () => {
            setTimeout(() => {
                const token = JSON.parse(localStorage.getItem("loggedUser"));
                setIsAuth(!!token);

                // Optional: Automatically redirect based on auth state
                if (token && location.pathname.startsWith("/auth")) {
                    navigate("/");
                } else if (!token && !location.pathname.startsWith("/auth")) {
                    navigate("/auth/intro");
                }
            }, 10);
        };

        // Listen to storage changes
        window.addEventListener("storage", handleStorageChange);

        // Initial check
        handleStorageChange();

        // Cleanup listener
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [navigate, location]);

    return (
        <RRDRoutes>
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute isAuth={isAuth} redirectTo="/auth/intro" />}>
                <Route index element={<Chapters />} />
                <Route path="chapter-docs" element={<ChapterDocs />} />
                <Route path="chapter-complete" element={<ChapterComplete />} />
                <Route path="quiz" element={<Quiz />} />
                <Route path="quiz-paper" element={<QuizPaper />} />
                <Route path="result" element={<Result />} />
                <Route path="answer-paper" element={<AnswerPaper />} />
                <Route path="certificate" element={<Certificate />} />
                <Route path="about" element={<About />} />
                <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Non-Authentication Routes */}
            <Route path="/auth" element={<NavigateRoute isAuth={isAuth} navigateTo="/" />}>
                <Route path="signin" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
                <Route path="another-signup" element={<AddAnotherAccount />} />
                <Route path="intro" element={<Intro />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<Error404 />} />
        </RRDRoutes>
    );
};
export default Routes;
