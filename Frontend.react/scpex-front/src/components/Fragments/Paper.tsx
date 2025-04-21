import { ReactNode, useEffect, useRef } from "react";
import { useBeforeUnload, useBlocker } from "react-router";

export default function Paper({ children, className, needRefresh = false }: { children: ReactNode | string | number, className?: string, needRefresh?: boolean }) {
    function renewHeight(padding: number = 15, px: number = 16) {
        if (!needRefresh) return;
        const paper = document.getElementById("paper");
        let spacing = parseFloat(window.getComputedStyle(paper!).getPropertyValue('--spacing').replace("rem", "")),
            target = paper!.querySelector("div.grid.grid-fill-paper") as HTMLElement;

        let result = window.innerHeight - (px * spacing * 2 * padding);
        target.style.minHeight = `${result}px`;

    }

    let paperInstance = useRef(null);

    useEffect(() => {
        renewHeight();
        window.addEventListener("resize", (e) => {
            renewHeight();
        })
    }, []);

    useBeforeUnload(() => {
        if(paperInstance?.current){
            console.log(paperInstance.current);
        }
    });

    useBlocker(({ currentLocation, nextLocation }) => {
        if(currentLocation.pathname !== nextLocation.pathname)
            console.log(paperInstance.current);
        console.log(currentLocation.pathname, nextLocation.pathname);
        return true;
    });

    return <div id="paper" ref={paperInstance} className={`py-15 fade-in min-h-screen px-3 md:px-5 lg:px-7 dark:text-slate-50 text-slate-950       ${className}`}>
        {children}
    </div>
}