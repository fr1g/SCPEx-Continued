import { useLocation, useNavigate, useParams } from "react-router"
import Paper from "../../components/Fragments/Paper";
import { useEffect } from "react";
import { UserCredential } from "../../models/UserCredential";
import { api } from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { slices as s } from "../../tools/ReduceHelper";

export default function User() {

    let { selector } = useParams();

    let userTarget: "this" | number = ((selector == "this" || selector == null || selector == undefined) ? "this" : parseInt(selector!))

    let resultUserInfo = { name: null }; // test

    let { userInfo } = useSelector((s: any) => s.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(
        () => {
            console.log(userInfo, ' uinfo')
            if (userTarget == "this") {
                async () => {
                    try {
                        let res = await api.Auth.getMe(userInfo.token);
                        let cred = JSON.parse(res.content);
                        if (res.title.includes("logged") && cred.contact == userInfo.contact && cred.id == userInfo.id) {
                            // actually do nothing... maybe need to quit early
                        }
                        else {
                            dispatch(s.auths.actions.loginFailure(null));
                            localStorage.removeItem('credential');
                            localStorage.jumpMessage = "Please login.";
                            navigate('/auth/login');
                        }
                    } catch (error: any) {
                        console.log(error.message)
                    }
                }
            }
        }
    )

    return <>
        <Paper  >
            <div>
                <p className="text-3xl font-semibold opacity-[1%]">
                    User: {userTarget == "this" ? "You" : resultUserInfo!.name ?? `Unknown (UID=${userTarget})`}
                </p>
            </div>
        </Paper>
    </>
}