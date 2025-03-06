import { useEffect, useState } from "react";

export const useThemeDetector = () => {
    console.log(`theme detector by llr. ${localStorage.theme}`)
    const getCurrentTheme = () => {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
    const mqListener = (e: MediaQueryListEvent) => {
        setIsDarkTheme(e.matches);
        localStorage.theme = e.matches ? "dark" : "light";
        if (e.matches) {
            document.documentElement.setAttribute("class", "dark");
            
        }else
            document.documentElement.setAttribute("class", "");
    };

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        darkThemeMq.addEventListener("change", mqListener);

        return () => darkThemeMq.removeEventListener("change", mqListener);
    }, []);

    return localStorage.getItem("theme")! !== null // ...
        ? localStorage.theme === "dark"
        : isDarkTheme;
};