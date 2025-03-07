import { ReactNode } from "react";

export default function Paper({children} : {children : ReactNode | string | number}){

    return <div className="py-15 min-h-screen px-3 md:px-5 lg:px-7 ">
        {children}
    </div>
}