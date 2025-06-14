import { ReactNode, useEffect, useRef } from "react";
import { useBeforeUnload, useLocation } from "react-router";
import useLeaveAnimate from "../../tools/LeaveAnimate";
import { motion, MotionStyle } from "framer-motion";
import { isDebug } from "../../env";

export default function Paper({ children, className, mfStyle, needRefresh = false }: { children: ReactNode | string | number, className?: string, mfStyle?: MotionStyle, needRefresh?: boolean }) {
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
        });
    }, []);

    if (isDebug)

        return <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={mfStyle ?? { position: 'absolute', width: '100%' }}
        >
            <div id="paper" ref={paperInstance} className={`py-15   ${mfStyle ? '' : 'min-h-screen'}   px-3 md:px-5 lg:px-7 dark:text-slate-50 text-slate-950       ${className}`}>
                {children}
            </div>
        </motion.div>

    else return <div id="paper" ref={paperInstance} className={`py-15   ${mfStyle ? '' : 'min-h-screen'}   px-3 md:px-5 lg:px-7 dark:text-slate-50 text-slate-950       ${className}`}>
        {children}
    </div>
}