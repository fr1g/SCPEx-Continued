import { useNavigate, Link, useLocation } from "react-router";
import Button from "../../components/Fragments/Button";
import { UserCredential } from "../../models/UserCredential";
import Trader from "../../models/UserType/Trader";
import { useEffect, useState } from "react";



export default function AfterRegister({ newUserRecv }: { newUserRecv: Trader | null }) {
    const navigate = useNavigate();
    // const [newUser, setNewUser] = useState<Trader | null>(null);
    const location = useLocation();
    const newUser = location.state?.newUser; // 从路由state获取用户
    
    // 添加加载状态处理
    if (!newUser) {
        return <div>Loading...</div>;
    }
    
    if (!newUser) {
        return (
            <div className="p-4 text-red-400">
                Error occurred. <Link to="/">Go back to Homepage.</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 p-4">
            <p>You have successfully registered!</p>
            <p>Your Login Name: <span onClick={() => window.navigator.clipboard.writeText(newUser.contact)} className="text-xl font-semibold underline hover:cursor-pointer">{newUser.contact}</span> (click to copy)</p>
            <p>Please use your Authenticator or Password Saver to keep your Login Password:</p>
            
            <Button onClick={() => navigator.clipboard.writeText(newUser.passwd)}>
                {newUser.passwd}
            </Button>
            <Button onClick={() => { navigate("/auth/login") }} className="bg-slate-500/70 py-2 text-white text-xl">
                Go back to Login
            </Button>
        </div>
    );
}