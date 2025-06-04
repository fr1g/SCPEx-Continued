import { useLocation, useNavigate, useParams } from "react-router"
import Paper from "../../components/Fragments/Paper";
import { useEffect, useState } from "react";
import { UserCredential } from "../../models/UserCredential";
import { api } from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { slices as s } from "../../tools/ReduceHelper";
import Button from "../../components/Fragments/Button";
import Employee from "../../models/UserType/Employee";
import Trader from "../../models/UserType/Trader";
import User from "../../models/UserType/User";
import { isUserTrader } from "../../tools/AuthTools";
import ViewLayout from "../View/ViewLayout";


export default function User_() { // as default export, regardless the name?

    let { selector } = useParams();

    let userTarget: "this" | number = ((selector == "this" || selector == null || selector == undefined) ? "this" : parseInt(selector!))


    let { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);
    // let userInfo = resultUserInfo as UserCredential;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [confirmLogoff, setConfirmLogoff] = useState(false);

    let [currUser, setCurrUser] = useState<Employee | Trader | null>(null);

    useEffect(
        () => {
            if (userTarget == "this") {
                (async () => {
                    try {
                        let res = await api.Auth.getMe(userInfo.token);
                        let cred = JSON.parse(res.content) as User;
                        console.log(res, ' res')
                        if (res.title.includes("logged") && cred.contact == userInfo.contact && cred.id == userInfo.id) {
                            // actually do nothing... maybe need to quit early
                            userInfo.note = cred.note ?? 'Nothing';
                            if (userInfo.note == '') {
                                console.log('nothing')
                                userInfo.note = 'Nothing';
                            }

                            console.log(userInfo);
                            if (isUserTrader(cred))
                                setCurrUser(res as Trader);
                            else setCurrUser(res as Employee);
                        }
                        else {
                            dispatch(s.auths.actions.loginFailure(null));
                            localStorage.removeItem('credential');
                            localStorage.jumpMessage = "Please login.";
                            navigate('/auth/login');
                        }
                    } catch (error: any) {
                        console.log(error.message)
                        if (error.message.includes("401")) {
                            dispatch(s.auths.actions.loginFailure(null));
                            localStorage.removeItem('credential');
                            localStorage.jumpMessage = "Please login.";
                            navigate('/auth/login');
                        }
                    }
                })()
            }
        }
    )

    async function LogOffHandler() {
        let token = userInfo.token;
        dispatch(s.auths.actions.loginFailure(null));
        localStorage.removeItem('credential');
        await api.Auth.logout(token);
        localStorage.jumpMessage = "Logged off.";
        navigate("/");
    }

    return <>
        <Paper  >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                <div className=" ?mx-auto mt-15">
                    <div className="text-center mb-1.5">
                        <img src="/favicon.png" alt="logo" width={"50%"} className="my-1 inline-block shadow" />
                    </div>
                    <h1 className="text-3xl font-semibold text-center my-3">Welcome, {userInfo.name}({userInfo.id})!</h1>
                    <div className="text-center">
                        <Button onClick={() => {
                            if (confirmLogoff) {
                                LogOffHandler();

                            } else setConfirmLogoff(true);
                        }} paddingless className="p-3 py-2 bg-rose-400/80">{confirmLogoff ? 'Confirm?' : 'Log Off'}</Button>
                    </div>
                    <br />
                    <div className="text-center my-3 w-[80%] mx-auto">
                        <div className="hr border-2 rounded-2xl my-3 shadow border-slate-500/50 mx-auto w-1/2 "></div>
                        <div className="bg-white/20 shadow-lg hover:shadow-xl p-3 transition rounded-xl">
                            Note: {(userInfo.note == "" || !userInfo.note) ? 'Nothing' : userInfo.note}
                        </div>
                        <div className="hr border-2 rounded-2xl my-3 shadow border-slate-500/50 mx-auto w-1/2 "></div>

                        <table className="rounded-lg border-2 border-slate-500 inline-block bg-white/20 shadow-lg my-3">
                            <tbody>
                                <tr className="border-b"><td className="p-3 py-1.5 opacity-50 italic">User Type: </td><td className="p-3 py-1.5">{userInfo.userType}</td></tr>
                                <tr className="border-b"><td className="p-3 py-1.5 opacity-50 italic">User Role: </td><td className="p-3 py-1.5">{userInfo.userClass}</td></tr>
                                <tr className="border-b"><td className="p-3 py-1.5 opacity-50 italic">Contact: </td><td className="p-3 py-1.5">{userInfo.contact}</td></tr>
                                <tr className=""><td className="p-3 py-1.5 opacity-50 italic">Status: </td><td className="p-3 py-1.5">{userInfo.status}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <ViewLayout cancelMf />
                    <div>
                        <p className="text-center">
                            okay, i dont know what else i can do.

                        </p>
                    </div>
                </div>
            </div>
        </Paper>
    </>
}