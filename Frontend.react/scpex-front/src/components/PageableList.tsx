import { Input } from "@headlessui/react";
import Pageable from "../models/Pageable";
import Button from "./Fragments/Button";
import ListItem from "./Fragments/ListItem";
import List from "./List";
import Icon from "./Fragments/Icon";
import { inputClassNames } from "../env";
import { useEffect, useState } from "react";
import { getTotals } from "../tools/misc";

export default function PageableList({ page, askNewPage, contentClickEvent = (e: any) => { console.log(`default of: ${e}`, e) } }: { page: Pageable | null, askNewPage?: Function, contentClickEvent?: Function }) {

    const [s, Ss] = useState(false);
    const [internalPage, setInternalPage] = useState<Pageable | null>(page);
    const [pageJump, setPageJump] = useState(1);


    function toPage(pageNum: number) {
        if (!askNewPage || !page) return;

        const newPage = Math.max(0, Math.min((getTotals(internalPage) == -2 ? 1 : getTotals(internalPage)) - 1, pageNum));

        if (newPage !== page.pageable.pageNumber) {
            setPageJump(newPage + 1);
            askNewPage(newPage);
        }
    }

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



    function pageJumpHandler(e: any){
        let valRaw = e.target.value;
        e.target.value = null;
        if(isNaN(valRaw) || valRaw == '') return;
        let val = parseInt(valRaw);
        if(val <= 0) return;
        toPage(val - 1) // to 0-based
        console.log(val);
    } 

    return <>

        <List>
            {page.content.map((self) => {
                return <ListItem onlyTopEvent={!(contentClickEvent == null)} title={self.name} key={self.id} id={self.id} onClick={(e) => contentClickEvent(e)} />
            })}
        </List>
        <div className="PAGINATOR   grid grid-cols-3 gap-3 p-3" >
            <Button watch={s} onClick={() => { toPage(internalPage?.pageable.pageNumber! - 1) }} className="rounded-lg" disable={internalPage?.pageable.pageNumber == 0 || askNewPage == undefined} >{(internalPage?.pageable.pageNumber == 0 || askNewPage == undefined) ? 'NOMORE' : (<Icon pua="e76b" />)}</Button>
            <Input className={`bg-gray-500/30 border-2 border-white  text-center   ${inputClassNames}`} onBlur={pageJumpHandler} placeholder={`${pageJump} / ${getTotals(internalPage!)}`} />
            <Button watch={s} onClick={() => { toPage(internalPage?.pageable.pageNumber! + 1) }} className="rounded-lg" disable={((internalPage?.pageable.pageNumber ?? 0) >= ((getTotals(internalPage!) ?? 0) - 1)) || askNewPage == undefined} >{(((internalPage?.pageable.pageNumber ?? 0) >= ((getTotals(internalPage!) ?? 0) - 1)) || askNewPage == undefined) ? 'NOMORE' : (<Icon pua="e76c" />)}</Button>
        </div>
    </>
}