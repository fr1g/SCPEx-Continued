import { Input, Switch, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { Link, useNavigate } from "react-router";
import Button from "../../components/Fragments/Button";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "../../components/Fragments/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { LoginDataTransfer } from "../../models/LoginDataTransfer";
import { useDispatch, useSelector } from "react-redux";
import { slices as s } from "../../tools/ReduceHelper";
import Toast from "../../components/Fragments/Toast";
import { UserCredential } from "../../models/UserCredential";
import { api } from "../../axios";

const traderTypes = [
    { id: 0, enum: 2, name: "Merchant/Producer" },
    { id: 1, enum: 1, name: "Employee" },
    // null
]

export default function Login() {
    let [rememberMe, setRememberMe] = useState(false);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(traderTypes[0]);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    let toast = useRef(null);
    const navigate = useNavigate();

    const {userInfo} = useSelector((state: any) => state.auth);


    const filtered = query === ''
        ? traderTypes
        : traderTypes.filter((type) => {
            return type.name.toLowerCase().includes(query.toLowerCase());
        });

    useEffect( () => {
        async function runCheck() {
            let token: string | null = null;
            if(localStorage.jumpMessage) localStorage.removeItem('jumpMessage');
            try {
                let cred = userInfo as UserCredential;
                console.log(cred.token);
                if(cred.token){
                    token = cred.token
                    let res = await api.Auth.getMe(cred.token);
                    let userInfo = JSON.parse(res.content)

                    if(res.title.includes("logged") && cred.contact == userInfo.contact && cred.id == userInfo.id ){
                        localStorage.jumpMessage = "You're already logged in!"
                        navigate("/user");
                    }
                    else {
                        dispatch(s.auths.actions.loginFailure(null));
                        localStorage.removeItem('credential');
                    }

                }
            } catch (error: any) {
                if(error.message.includes("bject]") || error.message.includes('is not valid JSON')){
                    console.log("invalid credential");
                    dispatch(s.auths.actions.loginFailure(null));
                    localStorage.removeItem('credential');
                    return;
                }
                if(error.message.includes('401')){
                    console.log("Not authenticated token");
                    dispatch(s.auths.actions.loginFailure(null));
                    localStorage.removeItem('credential');
                    return;
                }
                console.log(error, ' inLoginExcept')

            }
        }

        runCheck();
    }, []); 


    const onSubmit = (data: any) => {
        // if(data.contact)

        let req = new LoginDataTransfer(`${selected.id == 1 ? 'e' : 't'}#cont#${data.contact}`, data.passwd, rememberMe);
        dispatch(s.auths.actions.login(req.o()));
    };

    return <>
        <div>
            <p className="mb-3 text-xl">If you have no account of our membership yet, please go to <Link className="text-blue-400 hover:text-blue-300 active:text-blue-500 visited:text-sky-400/80 underline" to="/auth/register">Register</Link></p>
            <form onSubmit={handleSubmit(onSubmit)} id="login-form" className="grid grid-cols-1 gap-3" >
                <Input {...register("contact", {required: true, maxLength: 80})} name="contact" className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400" type="text" placeholder="Contact" />
                <Input {...register("passwd", {required: true, maxLength: 80})} name="passwd" className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400" type="password" placeholder="Password" />
                <div> As Role...
                    <div className="bg-gray-200/50 inline-block mx-3.5 rounded-lg shadow font-semibold text-lg">
                        <Combobox immediate
                            value={selected}
                            onClose={() => setQuery('')}

                            onChange={(val: { id: number, enum: number, name: string }) => { setSelected(val); }}
                        > 
                            {({ open }) => (
                                <>
                                    <div className="relative">
                                        <ComboboxInput required name="role"
                                            className={clsx(
                                                'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3  text-black dark:text-white',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                            displayValue={(person: { id: number, enum: number, name: string }) => person?.name}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                            <Icon pua="e76b" className="group-data-[open]:-rotate-90   ?-translate-1! h-[20px]" />
                                        </ComboboxButton>
                                    </div>
                                    <AnimatePresence>
                                        {open && (
                                            <ComboboxOptions
                                                className="origin-top border empty:invisible shadow-lg rounded-lg w-[230px] mt-1.5 border-none bg-white/5  text-black dark:text-white"
                                                static
                                                style={{ zIndex: 5 }}
                                                as={motion.div}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95, display: 'none' }}
                                                anchor="bottom"
                                                onAnimationComplete={() => setQuery('')}
                                            >
                                                {filtered.map((select: { id: number, enum: number, name: string }) => (
                                                    <ComboboxOption key={(select == null ? 5 : select.id)} value={select} className="data-[focus]:bg-blue-100 dark:data-[focus]:bg-slate-500 py-1.5 pr-8 pl-3 w-full border-none bg-white dark:bg-slate-800  text-black dark:text-white">
                                                        {select.name} <Icon pua="e73e" forceNoTranslate className={`${select.id == selected.id ? ' translate-y-0.5' : 'hidden!'}`} />
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </Combobox>
                    </div>
                </div>
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
                <Button id="LoginButton" className="text-xl font-semibold py-2" onClick={() => document.getElementById("login-form-submit")!.click()}>Login</Button>
            </form>
        </div>
        <Toast ref={toast} />
    </>
}