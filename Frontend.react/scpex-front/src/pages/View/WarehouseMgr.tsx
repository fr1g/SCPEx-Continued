import { useEffect, useState } from "react";
import PageableList from "../../components/PageableList";
import WrappedComboBox from "../../components/WrappedComboBox";
import Selectable from "../../models/Selectable";

import { slices } from "../../tools/ReduceHelper";
import Pageable from "../../models/Pageable";
import { useDispatch, useSelector } from "react-redux";
import { doInvalidCredentialAction, insufficientHandler, isCredTrader } from "../../tools/AuthTools";
import { UserCredential } from "../../models/UserCredential";
import { useNavigate } from "react-router";
import PageRequest from "../../models/PageRequest";
import { api } from "../../axios";
import EAUProducts from "../../components/EasyAUs/EasyAddUpdateProduct";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import EAUCategory from "../../components/EasyAUs/EasyAddUpdateCategory";
import { Input } from "@headlessui/react";
import Button from "../../components/Fragments/Button";
import { inputClassNames } from "../../env";
import Icon from "../../components/Fragments/Icon";
import { getById } from "../../tools/misc";

const changeSelected = slices.warehouseOperations.actions.changeSelection;
const updateSelectables = slices.warehouseOperations.actions.updateSelectables;

export default function WarehouseMgr() {

    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [curr, setCurr] = useState<Product | null>(null);
    const { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);
    const [sorting, setSorting] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [stateHasChanged, setStateHasChanged] = useState(false);
    const [pr, setPr] = useState<PageRequest>(new PageRequest());
    const [pageNum, setPageNum] = useState(0);
    const [searchText, setST] = useState("");

    // refresh logics
    // one per page for testing.

    async function refresh(page = 0) {

        try {
            await setTimeout(() => {
                console.log("%cI FUCKING DONT KNOW WHY I MAKE IT DELAY THEN THE PROBLEM GONE", "color: red; font-size: larger; font-weight: bold")
            }, 100);
            // console.log(pr, 'prpr')
            let products = await api.Stock.search(pr, page);
            console.log('should run now', products)
            setPageContent(JSON.parse(products.content))
        } catch (error: any) {
            if (error.message.includes("401")) {
                doInvalidCredentialAction(dispatch, navigate);
            }
            else console.error(error);
        }
        setStateHasChanged(_ => !_)

    }

    useEffect(() => {
        setPr((_: PageRequest) => {
            _.PageSize = 2; // testing.
            _.SearchField = "name";
            return _;
        });
    

        if (isCredTrader(userInfo))
            insufficientHandler(navigate)

        refresh();


    }, []);

    function switchAscDesc(){
        if(sorting == 'asc') setSorting('desc');
        else setSorting('asc');
        setPr((_: PageRequest) => {
            _.SortingMethod = sorting;
            return _;
        });
        refresh(pageNum);
    }

    function getNewPage(inPageNum: number){
        setPageNum(inPageNum);
        refresh(inPageNum); // 改为立即使用新页码
    }

    function commitSearch(){
        setPageNum(0);
        setPr((_: PageRequest) => {
            _.Keyword = searchText;
            return _;
        })
        refresh(pageNum);
    }

    function setCurr_(val: Product){
        // console.log(val);
        setCurr(val);
    }

    function innerClickHandler(e: any) {
        let clickedItemId = parseInt(e.nativeEvent.target.id!);
        // console.log(clickedItemId, 'ICH-ciid');
        setCurr_(getById(clickedItemId, pageContent!.content));
    }

    return <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 md:gap-3.5">
            <div className="col-span-1 md:col-span-3">
                <h1 className="text-3xl font-semibold">In Stock: </h1>

                {/* <i>{JSON.stringify(curr)}</i> */}
                <EAUProducts setItem={setCurr} item={curr} />
                <br /> 
                <div className="flex w-full flex-col? gap-3">
                    <Input onChange={(e) => {setST(e.target.value)}} className={"grow block! " + inputClassNames} placeholder="Search by name" />
                    <Button className="block! px-3.5! rounded-lg!" onClick={switchAscDesc} ><Icon pua="e8ab" className="rotate-90" /></Button>
                    <Button className="block! px-3.5! rounded-lg!" onClick={commitSearch} ><Icon pua="e721" /></Button>
                </div>
                <br />
                <PageableList page={pageContent} askNewPage={getNewPage} contentClickEvent={innerClickHandler} ></PageableList>
            </div>
            <div>
                <h1 className="text-3xl font-semibold">Cats: </h1>

                <EAUCategory st={stateHasChanged} stc={setStateHasChanged} />
            </div>
        </div>
    </>
}