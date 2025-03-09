import { useState } from "react";
import LOGO from "../../assets/images/logo.svg";
import langIcon from "../../assets/images/lang-icon.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useOS from "../../hooks/useOS";

const Header = () => {
    const os = useOS();
    const { i18n } = useTranslation();
    const [lang, setLang] = useState("en");
    const [windowStatus, setWindowStatus] = useState("default");

    // Handle language change
    const handleLangSwitch = (lng: any) => {
        i18n.changeLanguage(lng);
        setLang(lng);
    };

    return (
        <header id="header" style={{ zIndex: 100 }} className="bg-white border-bottom position-sticky top-0">
            <div className="container-fluid">
                <div style={{ paddingLeft: os === "macOS" ? 85 : 0 }} className="row header-height justify-content-between align-items-center">
                    <div className="col-auto title-bar-controls">
                        <Link to="/" className="btn p-0 btn-link">
                            <img src={LOGO} width={80} alt="logo" className="img-fluid" />
                        </Link>
                    </div>
                    <div className="col-auto title-bar-controls">
                        <div className="select-lang d-inline-flex align-items-center gap-1">
                            <img src={langIcon} alt="logo" className="img-fluid" />
                            <select
                                value={lang}
                                onChange={({ target: { value } }) => {
                                    handleLangSwitch(value);
                                }}
                                className="form-select text-center form-select-sm lang-switchable"
                            >
                                <option value={"en"}>English</option>
                                <option value="bn">বাংলা</option>
                            </select>
                            {os !== "macOS" ? (
                                <div style={{ marginRight: -5 }} className="window-custom-controller d-inline-flex gap-1 ms-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.Electron.ipcRenderer.send("window-minimize");
                                            setWindowStatus("minimized");
                                        }}
                                        className="btn p-0 btn-window-minimize"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.Electron.ipcRenderer.send("window-maximize");
                                            setWindowStatus(windowStatus === "maximized" ? "default" : "maximized");
                                        }}
                                        className="btn p-0 p-2 btn-window-maximize"
                                    >
                                        {windowStatus === "maximized" ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                stroke-width="0"
                                                viewBox="0 0 16 16"
                                                height="16"
                                                width="16"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M3 5v9h9V5H3zm8 8H4V6h7v7z"></path>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.Electron.ipcRenderer.send("window-close");
                                            setWindowStatus("closed");
                                        }}
                                        className="btn p-0 btn-window-close"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
