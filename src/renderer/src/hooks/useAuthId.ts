import { useEffect } from "react";

const useAuthId = () => {
    const setAuthId = () => {
        const loggedUser = localStorage.getItem("loggedUser");
        const user = loggedUser ? JSON.parse(loggedUser) : null;
        const authId = user?.id;

        if (authId) {
            (window as any).Electron?.setAuthId(authId); // Send to preload
        }
    };

    useEffect(() => {
        // Set on initial load
        setAuthId();

        // Listen for authId updates when user logs in
        const handleStorageChange = () => {
            setAuthId();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);
};

export default useAuthId;
