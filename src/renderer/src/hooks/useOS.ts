import { useState, useEffect } from "react";

const useOS = () => {
    const [os, setOS] = useState("Unknown");

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();

        if (userAgent.includes("mac")) setOS("macOS");
        else if (userAgent.includes("win")) setOS("Windows");
        else if (userAgent.includes("linux")) setOS("Linux");
        else if (userAgent.includes("android")) setOS("Android");
        else if (userAgent.includes("iphone") || userAgent.includes("ipad")) setOS("iOS");
    }, []);

    return os;
};

export default useOS;
