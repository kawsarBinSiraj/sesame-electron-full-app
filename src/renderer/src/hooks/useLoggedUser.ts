import { useState, useEffect } from "react";

/**
 * Custom hook to manage the logged-in user state.
 * It listens for changes in the "loggedUser" key in localStorage
 * and updates the user state accordingly.
 *
 * @returns The current logged-in user object or null if no user is logged in.
 */
const useLoggedUser = () => {
    const [user, setUser] = useState(() => {
        // Retrieve the logged user data from localStorage
        const loggedUser = localStorage.getItem("loggedUser");
        return loggedUser ? JSON.parse(loggedUser) : null;
    });

    useEffect(() => {
        /**
         * Event handler for storage changes.
         * Updates the user state if the "loggedUser" key changes.
         *
         * @param event - The storage event triggered on change.
         */
        const handleStorageChange = () => {
            const newValue = localStorage.getItem("loggedUser");
            setUser(newValue ? JSON.parse(newValue) : null);
        };

        // Add event listener for storage changes
        window.addEventListener("storage", handleStorageChange);
        return () => {
            // Clean up the event listener on component unmount
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return user;
};

export default useLoggedUser;
