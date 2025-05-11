import { useLocation, useParams } from "react-router"
import Paper from "../../components/Fragments/Paper";


export default function User(){

    let {selector} = useParams();

    let userTarget: "this" | number = ((selector == "this" || selector == null || selector == undefined) ? "this" : parseInt(selector!)) 

    let resultUserInfo = {name: null}; // test

    return <>
        <Paper  >
            <div>
                <h1 className="text-3xl font-semibold">User: {userTarget == "this" ? "You" : resultUserInfo!.name ?? `Unknown (UID=${userTarget})`}</h1>
            </div>
        </Paper>
    </>
}