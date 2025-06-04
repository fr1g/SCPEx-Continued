import { Input } from "@headlessui/react";
import Pageable from "../models/Pageable";
import Button from "./Fragments/Button";
import ListItem from "./Fragments/ListItem";
import List from "./List";
import Icon from "./Fragments/Icon";
import { inputClassNames } from "../env";
import { useEffect, useState } from "react";
import { getTotals } from "../tools/misc";

export default function PageableList({ page, askNewPage }: { page: Pageable | null, askNewPage?: Function }) {

    const [s, Ss] = useState(false);
    const [internalPage, setInternalPage] = useState<Pageable | null>(page);

    function toPage(pageNum: number) {
        if (!askNewPage || !page) return;

        // 添加边界判断
        const newPage = Math.max(0, Math.min((getTotals(internalPage) == -2 ? 1 : getTotals(internalPage)) - 1, pageNum));

        // 只有当页码变化时才触发
        if (newPage !== page.pageable.pageNumber) {
            askNewPage(newPage);
        }
    }

    useEffect(() => {
        console.log(
            "XXX the list refreshed."
        ); setInternalPage(page);
    });

    useEffect(() => {
        // setInternalPage({...page})
        setInternalPage(page);
    }, [page]);

    if (page == null || page.content.length == 0)
        return <>
            <div className="text-center text-xl animate-pulse my-3">
                No Content
            </div>
        </>

    return <>

        <List>
            {page.content.map((self) => {
                return <ListItem title={self.name} key={self.id} />
            })}
        </List>
        <div className="PAGINATOR   grid grid-cols-3 gap-3 p-3" >
            <Button watch={s} onClick={() => { toPage(internalPage?.pageable.pageNumber! - 1) }} className="rounded-lg" disable={internalPage?.pageable.pageNumber == 0 || askNewPage == undefined} >{ ( internalPage?.pageable.pageNumber == 0 || askNewPage == undefined ) ? 'NOMORE' : (<Icon pua="e76b" />)}</Button>
            <Input className={`bg-gray-500/30 border-2 border-white    ${inputClassNames}`} onBlur={(e) => { console.log(e) }} />
            <Button watch={s} onClick={() => { toPage(internalPage?.pageable.pageNumber! + 1) }} className="rounded-lg" disable={((internalPage?.pageable.pageNumber ?? 0) >= ((getTotals(internalPage!) ?? 0) - 1)) || askNewPage == undefined} >{( ((internalPage?.pageable.pageNumber ?? 0) >= ((getTotals(internalPage!) ?? 0) - 1)) || askNewPage == undefined ) ? 'NOMORE' : (<Icon pua="e76c" />)}</Button>
        </div>
        {/* 
            key problem:
                the internalPage (or even the page content list) cannot refresh in time
                after their refresh, the buttons wont change their state in time.
                
            
        */}
        <div>
            <div>{

                
                console.log((internalPage?.pageable.pageNumber ?? 0)) ?? internalPage?.pageable.pageNumber
            }</div>
            {
                console.log(((getTotals(internalPage!) ?? 0) - 1)) ?? typeof getTotals(internalPage!)
            }
        </div>
    </>
}