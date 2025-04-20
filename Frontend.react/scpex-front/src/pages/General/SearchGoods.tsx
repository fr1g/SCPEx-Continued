import Button from "../../components/Fragments/Button";
import Paper from "../../components/Fragments/Paper"
import { Input } from '@headlessui/react';
import { ReactNode, useEffect, useState, useRef } from "react";
import ListItem from "../../components/Fragments/ListItem";
import Icon from "../../components/Fragments/Icon";
import BasicStatistics from "../../components/Fragments/BasicStatistics";
import List from "../../components/List";

export default function SearchGoods() {
    const [results, setResults] = useState<ListItem[]>([]);
    const [isNoResult, setIsNoResult] = useState(false);
    const [keyword, setKeyword] = useState("");
    let searchboxRef = useRef(null);

    function mockResults() {
        let rs = [
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="https://avatars.mds.yandex.net/i?id=2a22d58d3db4aae1f1a69ff1631ec543_l-5208943-images-thumbs&n=13"></ListItem>,
            <ListItem title="unicol" cover="mocking failure of image  loading"></ListItem>,
            <ListItem cover="mocking failure of image  loading （with valid alt）"
                coverAlt="Alt is here"
                extra={<BasicStatistics category="-" sold="-" instock="-" />}
                price="114.51"
                detail="Nothing."
                title="We Love"
            ></ListItem>,
        ].reverse();

        // REMINDER the product requires a new place to storage images' json as base64

        setResults(rs as unknown as ListItem[]);
    }

    useEffect(() => {
        eval("publicSearchboxEffect()");
        console.log("Fired effect method");
    });

    function runSearch() {
        mockResults();
        console.log(keyword);
    }



    return <Paper needRefresh>
        <div className="w-full sm:max-w-[85%] md:max-w-[60%] mx-auto h-full? grid grid-cols-1 grid-fill-paper items-center justify-items-center justify-center transition-all">
            <div id="wrapper-search-with-list" className="w-full transition-all">
                <div id="searchbox-cont" className="grid grid-cols-5 w-full shadow-lg rounded-lg overflow-hidden bg-translate text-xl border-2 border-transparent focus-within:border-slate-500 ">
                    <Input placeholder="Search something..." ref={searchboxRef} onFocus={(e) => { setKeyword(e.target.value) }} onChange={(e) => { setKeyword(e.target.value) }} id="searhBox" 
                        className={`grow? col-span-4 bg-zinc-50 text-lg! fade-in z-[3] p-2! dark:bg-slate-500 outline-0 peer h-full text-slate-950 dark:text-white`} 
                    />
                    <Button onClick={runSearch} paddingless
                        className="w-full px-2.5 pr-2 py-1 bg-slate-400 hover:bg-slate-500 active:bg-slate-500/70 text-white font-semibold" borderless >
                        <Icon pua="e721" /><span className="hidden md:inline-block pl-0 lg:pl-3"> Search!</span>
                    </Button>

                </div>


                { keyword !== "" && (results.length !== 0 || isNoResult) &&
                    <div id="results" className="py-3 md:py-5" >
                        <p className="text-lg italic! mb-1 opacity-70">Results of "{keyword}":</p>
                        { results && 
                            <List>
                                {results.map(_ => <div key={Math.random()}>{_ as unknown as ReactNode}</div>)}
                            </List>
                        }
                    </div>
                }

            </div>
        </div>
    </Paper>
}