import Button from "../../components/Fragments/Button";
import Paper from "../../components/Fragments/Paper"
import {Input} from '@headlessui/react';

export default function SearchGoods(){
    return <Paper>
        <div className="w-full min-h-full grid items-center justify-items-center justify-center">
            <div id="wrapper-search-with-list">
                <div id="searchbox-cont flex gap-3">
                    <Input className={`grow bg-zinc-50 text-lg px-1.5 py-0.5 dark:bg-slate-500 rounded-lg outline-0  w-full? h-full  shadow focus:shadow-lg focus:shadow-slate-500`} />
                    <Button paddingless className="w-fit px-1.5 py-1" >Search</Button>
                </div>
            </div>
        </div>
    </Paper>
}