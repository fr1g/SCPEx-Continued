import { Input, ComboboxButton, Disclosure, DisclosureButton, Dialog, DialogPanel, DialogTitle, DisclosurePanel, Switch, Combobox, ComboboxOption, ComboboxOptions, ComboboxInput } from "@headlessui/react";
import { Route, Routes, useLocation, Link, useNavigate } from 'react-router';
import AfterRegister from "./AfterRegister";
import { UserCredential } from "../../models/UserCredential";
import { useState, useEffect } from "react";
import Button from "../../components/Fragments/Button";
import Icon from "../../components/Fragments/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import { useSelector } from "react-redux";
import { isatty } from "tty";
import Trader from "../../models/UserType/Trader";
import { GeneralStatus } from "../../models/GeneralEnum";
import { api } from "../../axios";
import { Operation } from "../../models/Operation";


// difference of register 
// register EMPLOYEE: inside "user management" page using "Add Employee" button
//  

const traderTypes = [
    { id: 0, enum: 2, name: "Customer/Merchant" },
    { id: 1, enum: 1, name: "Seller/M.Factory" },
    // null
]

export default function Register() {
    /**
     * Procedure:
     * Register at /register
     * /register got 'SUCCESS' with info
     * /register fire next step
     * GOTO /register/done PASS-IN created info
     * done
     */
    let [createdUser, setCreatedUser] = useState<Trader | null>(null);
    const navigate = useNavigate();

    function Registering() {
        let [showAlert, setShowAlert] = useState({ show: false, msg: "" });
        const [selected, setSelected] = useState(traderTypes[0]);
        const [query, setQuery] = useState('');
        let [agree, setAgree] = useState(false);
        const [submit, setSubmit] = useState(0);

        let { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);

        const filtered = query === ''
            ? traderTypes
            : traderTypes.filter((type) => {
                return type.name.toLowerCase().includes(query.toLowerCase());
            });

        let isAdmin = true; // test
        if (userInfo == null) isAdmin = false;
        else if ((userInfo.userClass == "admin" || userInfo.userClass == "registrar")) isAdmin = true;
        else isAdmin = false;

        // let isVerificated = false;
        // if(!isAdmin && !isVerificated) 


        async function submitContent(trader: Trader) {
            let cont: Trader | null = null;
            let exc = null
            try{
                if(submit == 1) return;
                setSubmit(1);
                let traderMod = trader;
                traderMod.locationJson = '{"location":  []}';
                traderMod.preferJson = '{"prefers":  []}';
                let res = await api.TraderManage.traderOperate(userInfo.token, new Operation('add', JSON.stringify(traderMod)));
                console.log(res);
                cont = JSON.parse(res.content) as Trader;
            } catch(ex: any){
                if(ex.message.includes('555')){
                    console.log("555: maybe caused by duplicated submit");
                } else {
                    console.log(ex);
                    exc = ex.message;
                }
            }finally{
                if(cont) {
                    setCreatedUser(cont);
                    console.log(cont, ' axw')
                    navigate("/auth/register/done", { 
                        state: { 
                            newUser: cont 
                        } 
                    });  // 添加state参数
                }
                else {
                    setShowAlert(
                        {
                            show: true,
                            msg: exc ?? 'Maybe you\'ve registered before.',
                        }
                    )
                }
            }
        }

        function submitHandler(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();

            if (!agree) {
                setShowAlert({ show: true, msg: `You MUST to agree to continue register. Or, farewell. (agree=${agree})` });
                return;
            }
            let essentials = {
                name: (document.getElementById("reg-name")! as HTMLInputElement).value!,
                contact: (document.getElementById("contact")! as HTMLInputElement).value!,

                birth: (document.getElementById("birth")! as HTMLInputElement).value == "" ? 0 :
                    (document.getElementById("birth")! as HTMLInputElement).value,

                typeEnum: selected.enum
            }

            // console.log(essentials);
            let newTrader = new Trader(0, essentials.name, essentials.contact, essentials.typeEnum, GeneralStatus.APPROVED, Date.now(), essentials.birth, "creatingNewUser",
                0, `Created by: ${(JSON.parse(localStorage.credential) as UserCredential).id}`);

            console.log(newTrader);
            submitContent(newTrader);

        }

        if (!isAdmin)
            return <>
                Here to write the guideline to become a membership
            </>

        return <>
            <Dialog open={showAlert.show} as="div" className="relative z-10 focus:outline-none" onClose={() => setShowAlert({ show: false, msg: showAlert.msg })}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl shadow bg-slate-500/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-xl font-medium text-black dark:text-white">
                                Alert
                            </DialogTitle>
                            <p className="mt-2 text-black dark:text-white text-lg">
                                {showAlert.msg}
                            </p>
                            <div className="mt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-600/90 py-1.5 px-3 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={() => setShowAlert({ show: false, msg: showAlert.msg })}
                                >
                                    Sure.
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <div>
                <form id="register-form" className="grid grid-cols-1 md:gap-3 gap-5" onSubmit={submitHandler} >
                    <div className="text-2xl">First, we need your basic information.</div>
                    <Input required className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400"
                        type="text" name="name" id="reg-name"
                        placeholder="Your Name, please." />
                    <div className="grid grid-cols-1">
                        <Input required className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400"
                            type="text" name="contact" id="contact"
                            placeholder="Contact" />
                        <p className="italic indent-1 opacity-80">Your contact will be the login name of your account.</p>
                    </div>
                    <div className="grid grid-cols-1">
                        <Input className="s font-xl p-2 bg-slate-50 dark:bg-slate-700 w-full outline-0 border-2 border-slate-200/80 dark:border-slate-500 transition rounded-lg shadow-md hover:shadow-sm focus:shadow-lg focus:border-slate-400"
                            type="date" name="birth" id="birth"
                            placeholder="" />
                        <p className="italic indent-1 opacity-80">Your birthday, which is NOT necessary.</p>
                    </div>

                    <div className="text-2xl">Next, please select your role.</div>
                    <div className="text-lg">
                        I am a
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

                    <div className="text-2xl">You must agree this agreement to register.</div>
                    <div className="-translate-y-3 rounded-lg bg-gray-200/50 ?dark:bg-gray-400 text-black dark:text-slate-50 my-1.5 p-2 shadow-md">
                        <Disclosure>
                            <DisclosureButton className="group flex items-center gap-2 w-full p-1.5">
                                <div className="grow text-left">EULA, Privacy and Membership agreement.</div>
                                <Icon pua="e76b" className="group-data-[open]:-rotate-90 float-right -translate-y-0.5! -translate-1! h-[16px]" />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-1 p-3">
                                <hr /><br />
                                <div className="p-1 max-h-[300px] overflow-scroll overflow-x-hidden!">
                                    Lorem ipsulm dolor sit amet.
                                    <Markdown>
                                        {(`### **End User License Agreement (EULA)**

                                        1. **License Grant**
                                        By downloading, installing, or using this software ("the Software"), you are granted a limited, non-exclusive, non-transferable, and revocable license to use the Software solely for personal or internal business purposes. You agree not to modify, reverse engineer, decompile, or disassemble the Software, except as permitted by applicable law.

                                        2. **Restrictions and Ownership**
                                        The Software is licensed, not sold. All intellectual property rights, including but not limited to copyrights, trademarks, and trade secrets, remain the sole property of the Company. You may not distribute, sublicense, or make the Software available to any third party without prior written consent.

                                        3. **Termination**
                                        This license is effective until terminated. Your rights under this license will terminate automatically if you fail to comply with any term of this agreement. Upon termination, you must cease all use of the Software and destroy all copies in your possession.

                                        ---

                                        ### **Privacy Policy**

                                        1. **Data Collection**
                                        We collect personal information that you provide to us, such as your name, email address, and payment details, when you register for an account, make a purchase, or interact with our services. We may also collect non-personal data, such as device information and usage statistics, to improve our services.

                                        2. **Data Usage**
                                        Your personal information is used to provide and improve our services, process transactions, and communicate with you. We do not sell or share your personal data with third parties, except as required by law or to trusted service providers who assist us in operating our business.

                                        3. **Your Rights**
                                        You have the right to access, update, or delete your personal information at any time. If you have any concerns about how your data is handled, please contact our support team. By using our services, you consent to the terms outlined in this Privacy Policy.

                                        ---

                                        ### **Membership Agreement**

                                        1. **Membership Eligibility**
                                        Membership is available to individuals who are at least 18 years old or have reached the age of majority in their jurisdiction. By signing up for membership, you agree to provide accurate and complete information during the registration process.

                                        2. **Membership Benefits and Fees**
                                        Members are entitled to exclusive benefits, including discounts, early access to new features, and premium support. Membership fees are billed on a recurring basis, and you agree to keep your payment information up to date. Fees are non-refundable unless otherwise stated.

                                        3. **Termination and Cancellation**
                                        You may cancel your membership at any time through your account settings. Upon cancellation, you will retain access to membership benefits until the end of the current billing cycle. The Company reserves the right to terminate your membership for violations of this agreement or misuse of the services.

                                        ---

                                        ### **Disclaimer**
                                        This document is for informational purposes only and does not constitute legal advice. For a legally binding agreement tailored to your specific needs, consult a qualified attorney.` as string).replaceAll('                                        ', '')}
                                    </Markdown>
                                </div>
                            </DisclosurePanel>
                        </Disclosure>

                        <div className="my-3.5 px-3"><hr /></div>

                        <div className="flex flex-row gap-2 border-2 border-zinc-400/80 dark:border-zinc-700/60 p-1.5 px-2.5 mt-1 rounded-xl" id="agreeWrap">
                            <div className="my-auto">
                                <Switch
                                    checked={agree}

                                    onChange={() => setAgree(n => !n)}
                                    className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-slate-700 transition data-[checked]:bg-blue-400"
                                >
                                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                </Switch>
                            </div>
                            <span className="p-1 block translate-x-1.5 -translate-y-0.5 grow">I had carefully read and I agree with it, and purposed to let this run its legal power.</span>
                        </div>
                    </div>
                    <input type="submit" id="register-form-submit" className="hidden" />
                    <Button className="text-xl font-semibold py-2" onClick={() => document.getElementById("register-form-submit")!.click()}>Register</Button>
                </form>
            </div>

        </>
    }
    return <>
        <Routes>
            <Route index element={<Registering />} />
            <Route path="/done" element={<AfterRegister newUserRecv={createdUser!} />} />
        </Routes>
    </>
}