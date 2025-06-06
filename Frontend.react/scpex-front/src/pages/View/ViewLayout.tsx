// general view of managements

import { Route, Routes } from "react-router";
import Paper from "../../components/Fragments/Paper";
import WarehouseMgr from "./WarehouseMgr";
import EmployeeMgr from "./EmployeeMgr.tsx";
import TraderMgr from "./TraderMgr.tsx";
import ViewNavigation from "./ViewNavigation";
import AddressBook from "./AddressBook";
import CartPage from "../General/Cart";
import OrderTracker from "./OrderTracker.tsx";

export default function ViewLayout({cancelMf} : {cancelMf?: boolean}) {
  return (
    <>
      <Paper className="w-full!  overflow-x-hidden! " mfStyle={cancelMf ? {} : undefined}>
        <ViewNavigation  />
        <div className="subXhidden">
          <Routes>
            <Route path="/employee-management" element={<EmployeeMgr />} />
            <Route path="/empm" element={<EmployeeMgr />} />
            <Route path="/trader-management" element={<TraderMgr />} />
            <Route path="/trdm" element={<TraderMgr />} />

            <Route path="/cart-management" element={<CartPage />} />
            <Route path="/warehouse" element={<WarehouseMgr />} />
            <Route path="/contract-negotiations" />
            <Route path="/address-book" element={<AddressBook />} />
            <Route path="/trades-tracker" element={<OrderTracker killPaperOutwrap />} />

            <Route index element={<div>Select your management above.</div>} />
          </Routes>
        </div>
      </Paper>
    </>
  );
}
