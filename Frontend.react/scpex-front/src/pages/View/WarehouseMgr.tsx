import { useEffect, useState } from "react";
import PageableList from "../../components/PageableList";
import WrappedComboBox from "../../components/WrappedComboBox";
import Selectable from "../../models/Selectable";

import { slices } from "../../tools/ReduceHelper";
import Pageable from "../../models/Pageable";
import { useSelector } from "react-redux";
import { insufficientHandler, isCredTrader } from "../../tools/AuthTools";
import { UserCredential } from "../../models/UserCredential";
import { useNavigate } from "react-router";
import PageRequest from "../../models/PageRequest";
import { api } from "../../axios";
import EAUProducts from "../../components/EasyAUs/EasyAddUpdateProduct";
import { Product } from "../../models/Product";

const changeSelected = slices.warehouseOperations.actions.changeSelection;
const updateSelectables = slices.warehouseOperations.actions.updateSelectables;

export default function WarehouseMgr(){

    let gotManageableWarehouses: Selectable[] = [
        new Selectable(0, "Warehouse1"),
        new Selectable(1, "Warehouse2"),
        new Selectable(2, "Warehouse Kalifornя"),
    ]; 

    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [curr, setCurr] = useState<Product | null>(null);
    const {userInfo} : {userInfo: UserCredential} = useSelector((s: any) => s.auth);
    const navigate = useNavigate();

    async function getPageItems(page = 0){
        let pr = new PageRequest();

        let res = await api.Stock.search(pr, page);
        console.log(res)
    }

    useEffect(() => {

        if(isCredTrader(userInfo))
            insufficientHandler(navigate)

        getPageItems();


    }, []);

    return <> 
        <h1 className="text-3xl font-semibold">Warehouse: </h1>
        <div className="flex items-end justify-items-center gap-1 flex-wrap">
            <p>Select managable warehouse:</p>
            <WrappedComboBox enums={gotManageableWarehouses} />
        </div>
        <i>{JSON.stringify(curr)}</i>
        <EAUProducts setItem={setCurr} item={curr} />
        <PageableList page={pageContent}></PageableList>
    </>
}