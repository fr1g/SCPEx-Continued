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
    const dispatch = useDispatch();


    // refresh logics

    
    async function refresh(page = 0){
        let pr = new PageRequest();

        try {
            let products = await api.Stock.search(pr, page);
            console.log('should run now', products)
            setPageContent(JSON.parse(products.content))
        } catch (error: any) {
            if(error.message.includes("401")){
                doInvalidCredentialAction(dispatch, navigate);
            }
            else console.error(error);
        }

    }

    useEffect(() => {

        if(isCredTrader(userInfo))
            insufficientHandler(navigate)

        refresh();


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