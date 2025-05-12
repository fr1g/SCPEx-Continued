import WrappedComboBox from "../../components/WrappedComboBox";
import Selectable from "../../models/Selectable";

import { slices } from "../../tools/ReduceHelper";

const changeSelected = slices.warehouseOperations.actions.changeSelection;
const updateSelectables = slices.warehouseOperations.actions.updateSelectables;

export default function WarehouseMgr(){

    let gotManageableWarehouses: Selectable[] = [
        new Selectable(0, "Warehouse1"),
        new Selectable(1, "Warehouse2"),
        new Selectable(2, "Warehouse Kalifornя"),
    ];

    return <> 
        <h1 className="text-3xl font-semibold">Warehouse: </h1>
        <div className="flex items-end justify-items-center gap-1 flex-wrap">
            <p>Select managable warehouse:</p>
            <WrappedComboBox enums={gotManageableWarehouses} />
        </div>
    </>
}