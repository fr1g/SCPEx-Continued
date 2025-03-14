import Button from "../../components/Fragments/Button";
import Paper from "../../components/Fragments/Paper"
import {Input} from '@headlessui/react';
import { ReactNode, useState } from "react";
import ListItem from "../../components/Fragments/ListItem";

export default function SearchGoods(){
    const [results, setResults] = useState<ListItem[]>([]);

    function mockResults(){
        let rs = [
            <ListItem cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
        ]

        setResults(rs as unknown as ListItem[]);
    }

    return <Paper needRefresh>
        <div className="w-[88vw] mx-auto h-full? grid grid-fill-paper items-center justify-items-center justify-center transition-all">
            <div id="wrapper-search-with-list" className="w-full transition-all">
                <div id="searchbox-cont" className="grid grid-cols-5 w-full shadow-lg rounded-lg bg-slate-400 text-xl ">
                    <Input className={`grow? col-span-4 bg-zinc-50 text-lg! z-[3] px-2! py-1! dark:bg-slate-500 rounded-l-lg outline-0  w-full? h-full peer focus:shadow-lg focus:shadow-slate-500`} />
                    <Button onClick={mockResults} paddingless className="w-full px-2.5 pr-2 py-1 rounded-r-lg bg-slate-400 hover:bg-slate-300 active:bg-slate-400/70 peer-focus:shadow-lg peer-focus:shadow-slate-500" borderless >Search</Button>
                
                </div>

                <div id="results" className="py-5" >
                    {results.map(_ => <div key={Math.random()}>{_ as unknown as ReactNode}</div>)}
                </div>

            </div>
        </div>
    </Paper>
}