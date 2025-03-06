import { ReactNode } from "react";

export default function Paper({children} : {children : ReactNode | string | number}){

    return <div className="">
        {children}
    </div>
}