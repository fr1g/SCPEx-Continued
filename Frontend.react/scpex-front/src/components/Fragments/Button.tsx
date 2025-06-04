import { ReactNode, MouseEventHandler, useEffect } from "react";

export default function Button(
    {children, id, watch, disable, className, fix = false, opacityEffect = true, borderless = false, paddingless = false, onClick = () => {console.error("[f]Unbinded click event.")}} 
    : 
    {children? : string | ReactNode | number, id?: string, watch?: any, disable?: boolean, className? : string, fix? : boolean, opacityEffect?: boolean, borderless? : boolean, paddingless? : boolean, onClick? : MouseEventHandler<HTMLButtonElement>}
){
    function disabledHandler(){
        console.log('the button has disabled.', id)
    }

    useEffect(() => {console.log("Button state has changed: ", id)});

    useEffect(() => {console.log('button refreshed caused by watch: ', id)}, [watch])

    return <button title={disable ? `DISABLED BUTTON (${id})` : id} id={id} onClick={disable ? disabledHandler : onClick} className={`transition ${opacityEffect ? 'opacity-100 hover:opacity-80 active:opacity-90' : ''} ${className} ${fix ? 'translate-y-[3.5px]' : ''} ${borderless ? '' : 'border rounded shadow-md hover:shadow-lg active:shadow'} ${paddingless ? '' : "px-1 pr-2.5 py-0.5"}   ${disable ? ' cursor-not-allowed pointer-events-none!? opacity-50 bg-gray-500/30!' : 'cursor-pointer'}   inline-block select-none  `}>
        <i style={{fontStyle: "normal"}} className="inline-block -translate-y-[1px]">{children}</i>
    </button>
}