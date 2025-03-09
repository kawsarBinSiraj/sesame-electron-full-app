import { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import Routes from "./routes/Routes";
import Header from "./components/layout/Header.comp";
import { I18nextProvider } from "react-i18next";
import useAuthId from "./hooks/useAuthId";
import i18n from "../../main/i18n/config"; // Import the i18n configuration

function App(): JSX.Element {
    useAuthId(); // Automatically sets authId
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    /**
     * @desc :- Handle language change
     * created_by :- Kawsar Bin Siraj (01/02/2025)
     */
    useEffect(() => {
        const handleLanguageChange = () => {
            setCurrentLanguage(i18n.language);
        };

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, []);

    return (
        <HashRouter basename="/">
            <I18nextProvider i18n={i18n}>
                <div id="app" className={`lang-${currentLanguage}`}>
                    <Header />
                    <main id="main-content">
                        <Routes />
                    </main>
                </div>
            </I18nextProvider>
        </HashRouter>
    );
}

export default App;
