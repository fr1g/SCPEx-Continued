import { ReactNode, useEffect } from "react";

export default function Paper({children, className, needRefresh = false} : {children : ReactNode | string | number, className : string, needRefresh?: boolean}){
    function renewHeight(padding: number = 15, px: number = 16){
        if(!needRefresh) return;
        const paper = document.getElementById("paper");
        let spacing = parseFloat(window.getComputedStyle(paper!).getPropertyValue('--spacing').replace("rem", "")),
            target = paper!.querySelector("div.grid.grid-fill-paper") as HTMLElement;

        let result = window.innerHeight - (px * spacing * 2 * padding);
        target.style.minHeight = `${result}px`;
 
    }

    useEffect(() => {
        renewHeight();
        window.addEventListener("resize", (e) => {
            renewHeight();
        })
    }, [])

    return <div id="paper" className={`py-15 min-h-screen px-3 md:px-5 lg:px-7      ${className}`}>
        {children}
    </div>
}