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
    
    const [darkMode, setDarkMode] = useState(true);

    function switchTheme (){
        setTheme(!darkMode);
    }

    function setTheme (setAsDark: boolean){
        if(setAsDark){
            document.documentElement.setAttribute("class", "dark");
            localStorage.theme = "dark";
            setDarkMode(true);
        }else{
            document.documentElement.setAttribute("class", "");
            localStorage.theme = "light";
            setDarkMode(false);
        }

    }    

    useEffect(() => {
        if(localStorage.theme == undefined || localStorage.theme == null){
        // if no value then use browser settings
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }else{
        // if got value then apply the value
            setTheme(localStorage.theme == "dark");
        }
        // set up matches and update when preference changed
        window.matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e: MediaQueryListEvent) => {
            
                console.log(`detected environment theme changed: dark`)
                setTheme(e.matches);
        });

        // window.matchMedia("(prefers-color-scheme: light)")
        //     .addEventListener("change", (e: MediaQueryListEvent) => {
            
        //         console.log(`detected environment theme changed: light`)
        //         setTheme(!e.matches);
        // });
    }, []);

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
                <Icon fix pua={ darkMode ? 'e706' : 'e708'} />
            </Button>
        </div>
        <Button  className="text-white bg-transparent hover:bg-blue-500/70 active:bg-blue-600/50 transition ">
            <Icon pua="e77b" spacing/>
            {credential?.name ?? "Login"}
        </Button>
    </div>
    </>
}