// general view of managements

import { Route, Routes } from "react-router";
import Paper from "../../components/Fragments/Paper";
import WarehouseMgr from "./WarehouseMgr";

export default function ViewLayout(){



    return <>
        <Paper>
            <div>
                <Routes>
                    <Route path="/user-management" />
                    <Route path="/cart-management" />
                    <Route path="/warehouse" element={<WarehouseMgr />} />
                    <Route path="/contract-negotiations" />
                    <Route path="/address-book" />
                    <Route path="/trades-tracker" />
                </Routes>
            </div>
        </Paper>
    
    </>
}