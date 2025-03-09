import { useEffect } from "react";
import Auth from "@renderer/components/layout/Auth.comp";
import { useNavigate } from "react-router-dom";

const Intro = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { ipcRenderer } = window.Electron;
                const fetchedUsers = await ipcRenderer.invoke("get-users");
                if (fetchedUsers && fetchedUsers.length) {
                    navigate("/auth/another-signup"); // Redirect if no users found
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [navigate]);

    return (
        <div id="intro-note">
            <Auth context="intro" />
        </div>
    );
};

export default Intro;
