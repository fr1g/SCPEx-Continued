import { useState, useEffect } from "react";
import { UserCredential } from "../models/UserCredential";
import Icon from "./Fragments/Icon";
import Button from "./Fragments/Button";
import { useThemeDetector } from "../tools/ThemeDetector.ts";
import { useLocation } from "react-router";

/* Dark mode strategy:
    - If localStorage is empty: get the current system color scheme
    - If localStorage has value: get the localStorage value
    - Standby: if triggered system color scheme, use the new scheme. 
    - Event: On click of button, switch to opposide and update the localStorage
    - Event: the system switch will update the localStorage, until the next user switch.
*/


// function getCurrentThemeMode() {
//     return localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
// }




export default function Header({ credential = null } : { credential: UserCredential | null }){

    let location = useLocation();

    const themeDetector = useThemeDetector();
    const [isDarkMode, setDarkMode] = useState(themeDetector);

    useEffect(() => {    
        setDarkMode(!themeDetector);
        localStorage.theme = isDarkMode ? "dark" : "light";   
        if (isDarkMode) {       
            document.documentElement.setAttribute("class", "dark");
            return;
        }
        document.documentElement.setAttribute("class", "");  
    }, []);

    function switchTheme() {
        setDarkMode(!isDarkMode);

        localStorage.theme = isDarkMode ? "dark" : "light";
        if (isDarkMode) {
            document.documentElement.setAttribute("class", "dark");
            return;
        }
        document.documentElement.setAttribute("class", "");
    }

    return <>
        <div className="fixed w-full p-2 bg-slate-600 flex flex-shrink px-5 gap-5 shadow-lg header z-very-top" >
        <div className="text-xl font-bold mb-1 text-white ">
            <a className="w-full h-full opacity-80 hover:opacity-100 transition" href="/">O'Petova</a>
        </div>
        <div className="text-lg ?font-semibold mb-1? translate-y-[1px] text-white ">
            <a className="w-full h-full border-b-0 hover:border-b-2 border-slate-100 transition nav-link" href="/search">
                Goods
            </a>
        </div>
        <div className={`${credential == null ? 'disabled' : ''} text-lg ?font-semibold mb-1? translate-y-[1px] text-white `}>
            <a className="w-full h-full border-b-0 hover:border-b-2 border-slate-100 transition nav-link" href="/cart">
                Cart
            </a>
        </div>
        <div className="text-lg ?font-semibold mb-1? translate-y-[1px] text-white ">
            <a className="w-full h-full border-b-0 hover:border-b-2 border-slate-100 transition nav-link" href="">
                Contact Us!
            </a>
        </div>
        <div className="flex-grow"></div>
        <div className="text-lg ?font-semibold mb-1 mr-1 text-white ">
            <Button  borderless paddingless onClick={switchTheme} >  
                <Icon fix pua={ document.documentElement.classList.contains("dark") ? 'e706' : 'e708'} />
            </Button>
        </div>
        <Button  className="text-white bg-transparent hover:bg-blue-500/70 active:bg-blue-600/50 transition ">
            <Icon pua="e77b" spacing/>
            {credential?.name ?? "Login"}
        </Button>
    </div>
    </>
}