import { useState } from "react";
import { UserCredential } from "../models/UserCredential";

export default function Header({ credential } : { credential: UserCredential | null }){

    const [prime, setPrime] = useState(credential?.isPrime ?? false);


    return <>
        <div className="bg-zinc-800">

        </div>
    </>
}