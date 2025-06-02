import { ReactNode, MouseEventHandler } from "react";

export default function Button(
    {children, id, className, fix = false, opacityEffect = true, borderless = false, paddingless = false, onClick = () => {console.error("[f]Unbinded click event.")}} 
    : 
    {children? : string | ReactNode | number, id?: string, className? : string, fix? : boolean, opacityEffect?: boolean, borderless? : boolean, paddingless? : boolean, onClick? : MouseEventHandler<HTMLButtonElement>}
){
    return <button id={id} onClick={onClick} className={`transition ${opacityEffect ? 'opacity-100 hover:opacity-80 active:opacity-90' : ''} ${className} ${fix ? 'translate-y-[3.5px]' : ''} ${borderless ? '' : 'border rounded shadow-md hover:shadow-lg active:shadow'} ${paddingless ? '' : "px-1 pr-2.5 py-0.5"}   cursor-pointer inline-block select-none  `}>
        <i style={{fontStyle: "normal"}} className="inline-block -translate-y-[1px]">{children}</i>
    </button>
}