import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { useState } from "react";
import Icon from "./Fragments/Icon";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Selectable from "../models/Selectable";


export default function WrappedComboBox({ enums, className, selectedIndex = 0, onChange = (o: Selectable, n: Selectable) => {}, getter, setter }: { enums: Selectable[], className?: string, selectedIndex?: number, onChange?: Function | null | undefined, getter?: any, setter?: Function}) {

    if(selectedIndex >= enums.length) 
        selectedIndex = (enums.length - 1)
    const [selected, setSelectedX] = useState(getter ?? enums[selectedIndex]);
    const [query, setQuery] = useState('');

    function setSelected(val: Selectable){
        let was = selected;
        setSelectedX(val);
        if(onChange) onChange(was, val);
        if(setter) setter(val);
    }

    const filtered = query === ''
        ? enums
        : enums.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
        });


    return <>
        <div className={`bg-gray-200/50 inline-block mx-3.5 rounded-lg shadow font-semibold text-lg   WCB//  ${className}`}>
            <Combobox immediate
                value={selected}
                onClose={() => setQuery('')}

                onChange={(val: Selectable) => { setSelected(val); }}
            >
                {({ open }) => (
                    <>
                        <div className="relative">
                            <ComboboxInput required name="role"
                                className={clsx(
                                    'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3  text-black dark:text-white',
                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                )}
                                displayValue={(select: Selectable) => select?.name}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                <Icon pua="e76b" className="group-data-[open]:-rotate-90   ?-translate-1! h-[20px]" />
                            </ComboboxButton>
                        </div>
                        <AnimatePresence>
                            {open && (
                                <ComboboxOptions
                                    className="origin-top border empty:invisible shadow-lg rounded-lg w-[230px] mt-1.5 ?border-none bg-white/5  text-black dark:text-white"
                                    static
                                    style={{ zIndex: 5 }}
                                    as={motion.div}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, display: 'none' }}
                                    anchor="bottom"
                                    onAnimationComplete={() => setQuery('')}
                                >
                                    {filtered.map((select: Selectable) => (
                                        <ComboboxOption key={(select == null ? 5 : select.id)} value={select} className={` @INFO=${select.info} ||   data-[focus]:bg-blue-100 dark:data-[focus]:bg-slate-500 py-1.5 pr-8 pl-3 w-full border-none bg-white dark:bg-slate-800  text-black dark:text-white`}>
                                            {select.name} <Icon pua="e73e" forceNoTranslate className={`${select.id == selected.id ? ' translate-y-0.5' : 'hidden!'}`} />
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </Combobox>
        </div>
    </>
}