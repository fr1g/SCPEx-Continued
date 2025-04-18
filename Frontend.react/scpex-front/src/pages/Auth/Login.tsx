import { Input, Switch } from "@headlessui/react";
import { Link } from "react-router";
import Button from "../../components/Fragments/Button";
import { useEffect, useState } from "react";

export default function Login() {
    let [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        document.getElementById("login-form")?.addEventListener("submit", (e) => {
            e.preventDefault();
            let n = new FormData(e.target! as unknown as HTMLFormElement);
            console.log(n);
        });
    });

    return <>
        <div>
            <p className="mb-3 text-xl">If you have no account of our membership yet, please go to <Link className="text-blue-400 hover:text-blue-300 active:text-blue-500 visited:text-sky-400/80 underline" to="/auth/register">Register</Link></p>
            <form id="login-form" className="grid grid-cols-1 gap-3" >
                <Input name="contact" className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400" type="text" placeholder="Contact" />
                <Input name="passwd" className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400" type="password" placeholder="Password" />
                <div className="" id="keepLoginWrap">
                    <Switch
                        checked={rememberMe}
                        onChange={() => setRememberMe(n => !n)}
                        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-slate-700 transition data-[checked]:bg-blue-400"
                    >
                        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                    <span className="p-1 inline-block translate-x-1.5 -translate-y-0.5">Remember Me</span>
                </div>
                <input type="submit" id="login-form-submit" className="hidden" />
                <Button className="text-xl font-semibold py-2" onClick={() => document.getElementById("login-form-submit")!.click()}>Login</Button>
            </form>
        </div>

    </>
}