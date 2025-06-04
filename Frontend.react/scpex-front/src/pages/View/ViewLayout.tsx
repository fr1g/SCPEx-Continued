// general view of managements

import { Route, Routes } from "react-router";
import Paper from "../../components/Fragments/Paper";
import WarehouseMgr from "./WarehouseMgr";
import EmployeeMgr from "./EmployeeMgr";
import TraderMgr from "./TraderMgr";
import ViewNavigation from "./ViewNavigation";

export default function ViewLayout({cancelMf} : {cancelMf?: boolean}) {
  return (
    <>
      <Paper className="w-full" mfStyle={cancelMf ? {} : undefined}>
        <ViewNavigation  />
        <div>
          <Routes>
            <Route path="/employee-management" element={<EmployeeMgr />} />
            <Route path="/empm" element={<EmployeeMgr />} />
            <Route path="/trader-management" element={<TraderMgr />} />
            <Route path="/trdm" element={<TraderMgr />} />

            <Route path="/cart-management" />
            <Route path="/warehouse" element={<WarehouseMgr />} />
            <Route path="/contract-negotiations" />
            <Route path="/address-book" />
            <Route path="/trades-tracker" />
          </Routes>
        </div>
      </Paper>
    </>
  );
}
