import { Input, Textarea } from "@headlessui/react";
import { Product } from "../../models/Product";
import WrappedComboBox from "../WrappedComboBox";
import Selectable from "../../models/Selectable";
import { GeneralStatus } from "../../models/GeneralEnum";
import { useEffect, useState } from "react";
import { inputClassNames } from "../../env";
import { getById, parseNumber, selectableGeneralStatus } from "../../tools/misc";
import { api } from "../../axios";
import { Category } from "../../models/Category";
import TitledInput from "../Fragments/TitledInput";
import Button from "../Fragments/Button";
import { UserCredential } from "../../models/UserCredential";
import { useDispatch, useSelector } from "react-redux";
import { Operation } from "../../models/Operation";
import { slices } from "../../tools/ReduceHelper";



export default function EAUProducts({ item, setItem, onSuccess }: { item: Product | null, setItem: Function, onSuccess?: Function }) {

    function changeHandler(key: string, val: any, parseAsNumber: true | 'int' | 'double' | false = false) {
        let raw = {
            ...item,
            [key]: parseAsNumber ? parseNumber(val, parseAsNumber) : val
        };
        console.log(raw, 'raw');
        if (key.toLowerCase().includes('category') && val && val.info)
            raw.category = JSON.parse(val.info);


        setItem(raw);
    }

    const statusEnums = selectableGeneralStatus;
    const [selectableCategories, setCategories] = useState<Selectable[]>([]);

    const { userInfo }: { userInfo: UserCredential | null } = useSelector((s: any) => s.auth);

    const [selectedEnum, setSelectedEnum] = useState(statusEnums[item?.status ?? 0]);

    const initCat = item == null ? selectableCategories![0] : item.category;
    const [selectedCat, setCat] = useState<Selectable | null>(null);  // 初始化为null
    const dispatch = useDispatch();

    const [isUpdate, setIsUpdate] = useState(false);

    async function submitHandler() {
        let prep = item;
        console.log(prep, 'preparing')
        let res: any;
        try {
            if (isUpdate) {
                res = await api.Stock.prodOps(userInfo!.token, new Operation('upd', JSON.stringify(prep)));
            } else {
                prep!.id = 0;
                res = await api.Stock.prodOps(userInfo!.token, new Operation('add', JSON.stringify(prep)));
            }
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.log(error)
            dispatch(slices.globalModal.actions.showModal({ title: "Unexpected", message: `${error}` }));
        }
    }

    // 修改分类匹配逻辑
    function ofCat(cat: Category, seleCats: Selectable[]) {
        return seleCats.find(n => n.id === cat?.id) || seleCats[0];
    }

    // // 修复分类组合框属性
    // <WrappedComboBox 
    //     title={`Category ${item?.category?.name ?? 'null'}`}
    //     className="w-full m-0!"
    //     enums={selectableCategories ?? []}
    //     getter={selectedCat}
    //     setter={setCatty}
    // />

    // 修复分类初始化逻辑
    // useEffect(() => {
    //     if (selectableCategories.length > 0 && item?.category) {
    //         const matchedCat = selectableCategories.find(c => c.id === item.category?.id);
    //         if (matchedCat) {
    //             setCat(matchedCat);
    //             changeHandler('category', matchedCat);
    //         }
    //     }
    // }, [selectableCategories, item?.category]);

    useEffect(() => {
        if (selectableCategories.length > 0 && item?.category) {
            const matchedCat = selectableCategories.find(c => c.id === item.category?.id);
            if (matchedCat && matchedCat.id !== selectedCat?.id) { // 添加变化检测
                setCat(matchedCat);
                changeHandler('category', matchedCat);
            }
        }
    }, [selectableCategories, item?.category]);

    // // 修复输入框同步问题（示例修改一个字段）
    // <TitledInput 
    //     value={item?.name ?? ''} 
    //     className={inputClassNames}
    //     placeholder="name"
    //     type="text"
    //     onChange={(e) => changeHandler('name', e.target.value)}
    //     key={item?.id || 'new'} // 添加key强制刷新
    // />

    // useEffect(() => {
    //     const loadCategories = async () => {
    //         try {
    //             await setTimeout(() => {

    //             }, 100)
    //             const catsReqd = await api.Stock.listCat();
    //             const rawCats = JSON.parse(catsReqd.content!) as Category[];
    //             const cats: Selectable[] = [];

    //             for (let c of rawCats) {
    //                 // let n = 
    //                 if (GeneralStatus[c.status] == 'REJECTED') continue;

    //                 cats.push(new Selectable(c.id!, c.name, JSON.stringify(c)));
    //             }

    //             setCategories(cats);

    //             // 设置默认选中项
    //             const defaultCat = item && ofCat(item?.category, cats);
    //             if (defaultCat) {
    //                 setCat(defaultCat);
    //                 changeHandler('category', defaultCat);
    //             }

    //         } catch (error) {
    //             console.error('Failed to load categories:', error);
    //         }
    //     };

    //     loadCategories();
    // }, []);

    useEffect(() => {
        let isMounted = true;
        const loadCategories = async () => {
            try {
                const catsReqd = await api.Stock.listCat();
                const rawCats = JSON.parse(catsReqd.content!) as Category[];
                
                if (!isMounted) return;
    
                const cats = rawCats
                    .filter(c => GeneralStatus[c.status] !== 'REJECTED')
                    .map(c => new Selectable(c.id!, c.name, JSON.stringify(c)));
    
                setCategories(prev => 
                    JSON.stringify(prev) === JSON.stringify(cats) ? prev : cats
                );
    
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
    
        loadCategories();
        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        if (selectableCategories.length > 0 && !selectedCat) {
            const defaultSelection = item && ofCat(item?.category, selectableCategories);
            setCat(defaultSelection);
            changeHandler('category', defaultSelection);
        }
    }, [selectableCategories, item?.category]);

    // useEffect(() => {

    //     if (item == undefined || item!.id == undefined || item!.id == 0 || `${item!.id}` == '' || (document.getElementById('inputID')! as HTMLInputElement).value! == '') {
    //         setIsUpdate(false)
    //     } else {
    //         setIsUpdate(true);
    //     }
    //     // 当item变化时同步表单状态
    //     if (item) {
    //         // 同步分类选择
    //         // const matchedCategory = selectableCategories.find(c => c.id === item.category?.id);
    //         setCat(selectableCategories[item.category?.id ?? 0]);

    //         // 同步状态选择
    //         // const matchedStatus = statusEnums.find(e => e.id === item.status);
    //         setSelectedEnum(statusEnums[parseInt(GeneralStatus[item.status])]);
    //         console.log(item, statusEnums[parseInt(GeneralStatus[item.status])], getById(item.category?.id ?? 0, selectableCategories), 'changedSelection')
    //     }
    // }, [item]);

    useEffect(() => {
        if (item == undefined || item!.id == undefined || item!.id == 0 || `${item!.id}` == '' || (document.getElementById('inputID')! as HTMLInputElement).value! == '') {
            setIsUpdate(false)
        } else {
            setIsUpdate(true);
        }
        if (item) {
            if (selectableCategories.length > 0 && item.category?.id) {
                const shouldUpdate = !selectedCat || selectedCat.id !== item.category.id;
                shouldUpdate && setCat(getById(item.category.id, selectableCategories));
            }

            const statusIndex = statusEnums.findIndex(e => e.id === item.status);
            if (statusIndex !== -1 && selectedEnum?.id !== statusEnums[statusIndex]?.id) {
                setSelectedEnum(statusEnums[statusIndex]);
            }
        }
    }, [item]);

    function setSelectedEnum_(value: any) {

        setSelectedEnum(value);
        // console.log(selectedEnum, ' a')
        changeHandler('status', value.id, true)
    }

    function setCatty(val: Selectable) {
        setCat(val);
        changeHandler('category', val);
    }

    function spareNewEmpty() {
        // setIsUpdate(false);
        const emptyProduct = {
            id: undefined,
            name: '',
            barcode: '',
            size: '',
            feature: '',
            warehouse: '',
            amount: undefined,
            singlePrice: undefined,
            discount: 1,
            status: 0,
            category: selectableCategories[0].info ? JSON.parse(selectableCategories[0].info) : null
        } as unknown as Product;

        setItem(emptyProduct);

        // 强制重置组合框选择
        setSelectedEnum(statusEnums[0]);
        setCat(selectableCategories[0] || null);

        console.log(item, 'SET CLEAR FOR CREATING')
    }



    return <>

        <form action="" className=" grid grid-cols-1 md:grid-cols-3 gap-1" onSubmit={(e) => { e.preventDefault() }}>
            <div className="grid grid-cols-2 gap-1 ">
                <TitledInput id="inputID" value={item?.id ?? ''} title="ID" className={inputClassNames} placeholder="Keep empty to create" type="number" onChange={(e) => changeHandler('id', e.target.value, true)} />
                <TitledInput value={item?.amount ?? ''} className={inputClassNames} placeholder="amount" type="number" onChange={(e) => changeHandler('amount', e.target.value, true)} />
            </div>
            <div className="grid grid-cols-2 gap-1 ">
                <TitledInput value={item?.singlePrice ?? ''} className={inputClassNames} placeholder="singlePrice" type="number" onChange={(e) => changeHandler('singlePrice', e.target.value, true)} />
                <TitledInput value={item?.discount ?? ''} className={inputClassNames} placeholder="discount" type="number" onChange={(e) => changeHandler('discount', e.target.value, true)} />
            </div>

            <TitledInput value={item?.name ?? ''} className={inputClassNames} placeholder="name" type="text" onChange={(e) => changeHandler('name', e.target.value)} />
            <TitledInput value={item?.barcode ?? ''} className={inputClassNames} placeholder="barcode" type="text" onChange={(e) => changeHandler('barcode', e.target.value)} />
            <TitledInput value={item?.size ?? ''} className={inputClassNames} placeholder="size" type="text" onChange={(e) => changeHandler('size', e.target.value)} />
            <TitledInput value={item?.feature ?? ''} className={inputClassNames} placeholder="feature" type="text" onChange={(e) => changeHandler('feature', e.target.value)} />
            <TitledInput value={item?.warehouse ?? ''} className={inputClassNames} placeholder="warehouse" type="text" onChange={(e) => changeHandler('warehouse', e.target.value)} />

            <WrappedComboBox title={`Status ${item?.status ?? 'null'}`} className="w-full m-0!" enums={statusEnums} selectedIndex={item?.status ?? 0} getter={selectedEnum} setter={setSelectedEnum_} />

            <WrappedComboBox title={`Category ${item?.category?.name ?? 'null'}`} className="w-full m-0!"
                enums={selectableCategories ?? []}
                selectedIndex={selectedCat == null ? selectableCategories.indexOf(selectedCat!) : 0}
                getter={selectedCat}
                setter={setCatty}
            />

            {/* <TitledInput Class="md:col-span-2 col-span-1 block" className={inputClassNames + ' md:col-span-2 col-span-1 block'} placeholder="note" type="text" onChange={(e) => changeHandler('note', e.target.value)} /> */}
            <Textarea value={item?.note ?? ''} className={inputClassNames + ' md:col-span-2 col-span-1 block min-h-[50px]'} placeholder="Product Details (note: markdown)" onChange={(e) => changeHandler('note', e.target.value)}  >

            </Textarea>
            <div className="grid items-end">
                <div>
                    Updating: {isUpdate ? 'yes' : 'no'}
                </div>
                <div id="controls" className="grid grid-cols-2 gap-2 max-h-[31px]">
                    <Button onClick={spareNewEmpty} >Create</Button>
                    <Button onClick={submitHandler} >Submit</Button>
                </div>
            </div>
        </form>
    </>
}
