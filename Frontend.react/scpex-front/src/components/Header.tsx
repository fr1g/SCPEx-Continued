import { useState, useEffect, useContext } from "react";
import { UserCredential } from "../models/UserCredential";
import Icon from "./Fragments/Icon";
import Button from "./Fragments/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { slices as s } from "../tools/ReduceHelper";

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

export default function Header() {
    const [state, setState] = useState(false);
    const stateHasChanged = () => { setState(_ => !_) } // maybe useless, because after login the page has rerendered so the new state should be just applied as the new storaged info read.

    let { userInfo } = useSelector((s: any) => s.auth);
    let credential = userInfo as UserCredential;
    let location = useLocation();

    const navBarLinks = [
        { key: 1, title: "Goods", link: "/search", disabled: false },
        { key: 11, title: "MGR", link: "/view", disabled: credential == null },
        { key: 111, title: "Contact Us!", link: "/about", disabled: false },
    ];


    const [darkMode, setDarkMode] = useState(true);

    function switchTheme() { setTheme(!darkMode); }

    function setTheme(setAsDark: boolean) {
        if (setAsDark) {
            document.documentElement.setAttribute("class", "dark");
            localStorage.theme = "dark";
            setDarkMode(true);
        } else {
            document.documentElement.setAttribute("class", "");
            localStorage.theme = "light";
            setDarkMode(false);
        }

    }
    // next to implement: make the darkmode able to be back to "synced to the system" (always check if the theme  that is matched to current theme (check on load?))
    useEffect(() => {
        console.log(credential)
        if (localStorage.theme == undefined || localStorage.theme == null) {
            // if no value then use browser settings
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
        } else {
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

    useEffect(() => {
        // {credential} = useSelector((s: any) => s.auth)
        console.log(' header changed dir ');
        
    }, [location])

    let nav = useNavigate();

    function loginButtonHandler() {


        if (credential != null && !(credential.userClass == "registrar" || credential.userClass == "admin")) 
            nav(`/user`); // the non-registrar should be pointed to the user info page
        else 
            nav(`/auth`);

    }

    return <>
        <div className="fixed w-full p-2 bg-slate-600 flex flex-shrink px-5 gap-3 md:gap-5 shadow-lg header z-very-top" >
            <div className="text-xl font-bold mb-1 text-white translate-y-[1px]">
                <a className="w-full h-full opacity-80 hover:opacity-100 transition " href="/">O'Petova</a>
            </div>

            {navBarLinks.map(x => {
                return <div key={x.key} className={`${x.disabled ? 'disabled' : ''} text-lg hidden md:block ?font-semibold mb-1? translate-y-[3px] text-white `}>
                    <a className="w-full h-full border-b-0 hover:border-b-2 border-slate-100 transition nav-link"   onClick={() => {nav(x.link)}}>
                        {x.title}
                    </a>
                </div>
            })}


            <div className="flex-grow"></div>

            <div className="text-lg mb-1 mr-1 text-white block md:hidden">
                <Menu>
                    <MenuButton className="text-lg translate-y-[0.055rem] md:mb-1 mr-1 text-white ">
                        <Icon fix pua="e700" />
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-full mt-3.5 origin-top-right rounded-xl border border-white/15 bg-slate-600 z-10 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        {navBarLinks.map(x => {
                            return <MenuItem key={x.key}>
                                <div className={`${x.disabled ? 'disabled' : ''}   group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white `}>
                                    <a className="w-full h-full border-b-0 hover:border-b-2 border-slate-100 transition nav-link"   onClick={() => {nav(x.link)}}>
                                        {x.title}
                                    </a>
                                </div>
                            </MenuItem>
                        })}
                        
                    </MenuItems>
                </Menu>
            </div>
            <div className="text-lg translate-y-[0.055rem] md:mb-1 mr-1 text-white ">
                <Button borderless paddingless onClick={switchTheme} >
                    <Icon fix pua={darkMode ? 'e706' : 'e708'} />
                </Button>
            </div>
            <Button onClick={loginButtonHandler} className="text-white use-icon bg-transparent hover:bg-blue-500/70 active:bg-blue-600/50 transition ">
                <Icon pua="e77b" spacing  />
                {credential?.name ?? "Login"}
            </Button>
        </div>
    </>
}