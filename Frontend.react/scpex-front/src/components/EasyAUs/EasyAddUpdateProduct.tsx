import { Input } from "@headlessui/react";
import { Product } from "../../models/Product";
import WrappedComboBox from "../WrappedComboBox";
import Selectable from "../../models/Selectable";
import { GeneralStatus } from "../../models/GeneralEnum";
import { useState } from "react";
import { inputClassNames } from "../../env";
import { parseNumber } from "../../tools/misc";



export default function EAUProducts({item, setItem} : {item: Product | null, setItem: Function}) {

    function changeHandler(key: string, val: any, parseAsNumber: true | 'int' | 'double' | false = false){
        let raw = {
            ...item,
            [key]: parseAsNumber ? parseNumber(val, parseAsNumber) : val
        };

        // raw[key] = val;

        setItem(raw);
    }

    const statusEnums = [
        new Selectable(0, GeneralStatus[0]),
        new Selectable(1, GeneralStatus[1]),
        new Selectable(2, GeneralStatus[2]),
        new Selectable(3, GeneralStatus[3]),
        new Selectable(4, GeneralStatus[4]),
        new Selectable(5, GeneralStatus[5]),
    ]

    const [selectedEnum, setSelectedEnum] = useState(statusEnums[item?.status ?? 0]);

    function setSelectedEnum_(value: any){
        
        setSelectedEnum(value);
        // console.log(selectedEnum, ' a')
        changeHandler('status', value.id, true)
    }

    return <>
        <form action="" className=" grid grid-cols-1 md:grid-cols-3 gap-1">
            <Input className={inputClassNames} placeholder="id" type="number" onChange={(e) => changeHandler('id', e.target.value, true)}  />
            <Input className={inputClassNames} placeholder="amount" type="number" onChange={(e) => changeHandler('amount', e.target.value, true)}  />
            <Input className={inputClassNames} placeholder="singlePrice" type="number" onChange={(e) => changeHandler('singlePrice', e.target.value, true)}  />
            <Input className={inputClassNames} placeholder="discount" type="number" onChange={(e) => changeHandler('discount', e.target.value, true)}  />

            <Input className={inputClassNames} placeholder="name" type="text" onChange={(e) => changeHandler('name', e.target.value)}  />
            <Input className={inputClassNames} placeholder="barcode" type="text" onChange={(e) => changeHandler('barcode', e.target.value)}  />
            <Input className={inputClassNames} placeholder="size" type="text" onChange={(e) => changeHandler('size', e.target.value)}  />
            <Input className={inputClassNames} placeholder="feature" type="text" onChange={(e) => changeHandler('feature', e.target.value)}  />
            <Input className={inputClassNames} placeholder="warehouse" type="text" onChange={(e) => changeHandler('warehouse', e.target.value)}  />

            <WrappedComboBox className="w-full m-0!" enums={statusEnums} selectedIndex={item?.status ?? 0} getter={selectedEnum} setter={setSelectedEnum_} />
            
            <div>
            {JSON.stringify(selectedEnum)}
            </div>

            <Input className={inputClassNames} placeholder="note" type="text" onChange={(e) => changeHandler('note', e.target.value)}  />

            <Input className={inputClassNames} placeholder="id" type="text" onChange={(e) => changeHandler('id', e.target.value)}  />
            <Input className={inputClassNames} placeholder="id" type="text" onChange={(e) => changeHandler('id', e.target.value)}  />

        </form>
    </>
}