import { Input } from "@headlessui/react";
import { Product } from "../../models/Product";
import WrappedComboBox from "../WrappedComboBox";
import Selectable from "../../models/Selectable";
import { GeneralStatus } from "../../models/GeneralEnum";
import { useEffect, useState } from "react";
import { inputClassNames } from "../../env";
import { parseNumber, selectableGeneralStatus } from "../../tools/misc";
import { api } from "../../axios";
import { Category } from "../../models/Category";
import TitledInput from "../Fragments/TitledInput";



export default function EAUProducts({ item, setItem }: { item: Product | null, setItem: Function }) {

    function changeHandler(key: string, val: any, parseAsNumber: true | 'int' | 'double' | false = false) {
        let raw = {
            ...item,
            [key]: parseAsNumber ? parseNumber(val, parseAsNumber) : val
        };
        setItem(raw);
    }

    const statusEnums = selectableGeneralStatus;
    const [selectableCategories, setCategories] = useState<Selectable[]>([]);

    const [selectedEnum, setSelectedEnum] = useState(statusEnums[item?.status ?? 0]);

    const initCat = item == null ? selectableCategories![0] : item.category;
    const [selectedCat, setCat] = useState<Selectable | null>(null);  // 初始化为null

    // 初始化分类数据
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const catsReqd = await api.Stock.listCat();
                const rawCats = JSON.parse(catsReqd.content!) as Category[];
                const cats = rawCats.map(c =>
                    new Selectable(c.id, c.name, JSON.stringify(c))
                );

                setCategories(cats);

                // 设置默认选中项
                const defaultCat = item?.category ?? cats[0];
                if (defaultCat) {
                    setCat(defaultCat);
                    changeHandler('category', defaultCat);
                }

            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        if (selectableCategories.length > 0 && !selectedCat) {
            const defaultSelection = item?.category ?? selectableCategories[0];
            setCat(defaultSelection);
            changeHandler('category', defaultSelection);
        }
    }, [selectableCategories, item?.category]);

    function setSelectedEnum_(value: any) {

        setSelectedEnum(value);
        // console.log(selectedEnum, ' a')
        changeHandler('status', value.id, true)
    }

    function setCatty(val: any) {
        setCat(val);
        changeHandler('category', val);
    }



    return <>
    
        <form action="" className=" grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="grid grid-cols-2 gap-1 ">
                <TitledInput title="ID" className={inputClassNames} placeholder="Keep empty to create" type="number" onChange={(e) => changeHandler('id', e.target.value, true)} />
                <TitledInput className={inputClassNames} placeholder="amount" type="number" onChange={(e) => changeHandler('amount', e.target.value, true)} />
            </div>
            <div className="grid grid-cols-2 gap-1 ">
                <TitledInput className={inputClassNames} placeholder="singlePrice" type="number" onChange={(e) => changeHandler('singlePrice', e.target.value, true)} />
                <TitledInput className={inputClassNames} placeholder="discount" type="number" onChange={(e) => changeHandler('discount', e.target.value, true)} />
            </div>

            <TitledInput className={inputClassNames} placeholder="name" type="text" onChange={(e) => changeHandler('name', e.target.value)} />
            <TitledInput className={inputClassNames} placeholder="barcode" type="text" onChange={(e) => changeHandler('barcode', e.target.value)} />
            <TitledInput className={inputClassNames} placeholder="size" type="text" onChange={(e) => changeHandler('size', e.target.value)} />
            <TitledInput className={inputClassNames} placeholder="feature" type="text" onChange={(e) => changeHandler('feature', e.target.value)} />
            <TitledInput className={inputClassNames} placeholder="warehouse" type="text" onChange={(e) => changeHandler('warehouse', e.target.value)} />

            <WrappedComboBox title="Status" className="w-full m-0!" enums={statusEnums} selectedIndex={item?.status ?? 0} getter={selectedEnum} setter={setSelectedEnum_} />
 
            <WrappedComboBox title="Category" className="w-full m-0!"
                enums={selectableCategories ?? []}
                selectedIndex={selectedCat == null ? selectableCategories.indexOf(selectedCat!) : 0}
                getter={selectedCat}
                setter={setCatty}
            />
            <TitledInput className={inputClassNames} placeholder="note" type="text" onChange={(e) => changeHandler('note', e.target.value)} />

        </form>
    </>
}
