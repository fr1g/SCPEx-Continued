import { Input } from "@headlessui/react";
import { ReactNode } from "react";




export default function TitledInput({className, placeholder, type, value, onChange, title, children, Class, titleClass, id} : {
    className?: string, 
    placeholder?: string, 
    type?: string, 
    value?: string | number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,  // 改为可选属性
    title?: string, 
    children?: ReactNode, 
    Class?: string, 
    titleClass?: string,
    id?: string
}){
    return <div className={Class}>
        <h5 className={titleClass ?? "italic text-xl"}>{title ?? placeholder}</h5>
        <Input 
            id={id}
            className={className} 
            placeholder={placeholder} 
            value={value}
            title={title} 
            type={type} 
            onChange={onChange}  // 直接透传onChange
        />
        {children}
    </div>
}