import { Input } from "@headlessui/react";
import { ReactNode } from "react";




export default function TitledInput({className, placeholder, type, onChange, title, children, Class, titleClass} : {
    className?: string, 
    placeholder?: string, 
    type?: string, 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,  // 改为可选属性
    title?: string, 
    children?: ReactNode, 
    Class?: string, 
    titleClass?: string
}){
    return <div className={Class}>
        <h5 className={titleClass ?? "italic text-xl"}>{title ?? placeholder}</h5>
        <Input 
            className={className} 
            placeholder={placeholder} 
            title={title} 
            type={type} 
            onChange={onChange}  // 直接透传onChange
        />
        {children}
    </div>
}