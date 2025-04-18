import { useNavigate, Link } from "react-router";
import Button from "../../components/Fragments/Button";
import { UserCredential } from "../../models/UserCredential";




export default function AfterRegister({newUser} : {newUser: UserCredential} ){

    let navigate = useNavigate();

    if(newUser === null) return <>Error occured. <Link to="/">Go back to Homepage.</Link></>

    return <>
        <div className="grid grid-cols-1 gap-3">
            <p>You have successfully registered!</p>
            <p>Your Login Name: <span onClick={() => window.navigator.clipboard.writeText(newUser.contact)} className="text-xl font-semibold underline hover:cursor-pointer">{newUser.contact}</span> (click to copy)</p>
            <p>Please use your Authenticator or Password Saver to keep your Login Password:</p>
            <Button className="text-2xl font-semibold py-1.5 w-full pb-2 bg-slate-600/90 hover:bg-slate-600 text-slate-50" onClick={() => window.navigator.clipboard.writeText(newUser.token)}>
                {newUser.token}<span className="text-base block">(Click to Copy)</span>
            </Button>
            <Button onClick={() => {navigate("/auth/login")}} className="bg-slate-500/70 py-2 text-white text-xl">
                Go back to Login
            </Button>
        </div>
    </>

}