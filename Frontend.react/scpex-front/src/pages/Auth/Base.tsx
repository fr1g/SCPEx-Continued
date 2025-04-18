import Button from "../../components/Fragments/Button"
import { useNavigate } from "react-router"


export default function AuthBase(){

    let redirect = useNavigate();

    function toLogin() { redirect("/auth/login"); }
    function toRegist() { redirect("/auth/register"); }

    return <>
        <p className="text-xl text-slate-950 dark:text-slate-50">Welcome to O'Petova!</p>
        <div className="grid grid-cols-1 gap-3 mt-3 text-xl text-white">
            <Button onClick={toLogin} className="block text-center py-2 bg-slate-600/90 hover:bg-slate-600">Login</Button>
            <Button onClick={toRegist} className="block text-center py-2 bg-slate-500/80">Register</Button>
            <p className=" text-black dark:text-slate-50">
                The administrator requires to register by contacting to the Registrar and become a membership.
            </p>
        </div>
    </>
}