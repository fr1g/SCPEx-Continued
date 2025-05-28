import auth from './Auth.ts';
import emgr from './EmployeeMgr.ts';
import tmgr from './TraderMgr.ts';
import prod from './ProdAndWarehouse.ts';
import trade from './Trades.ts';

export const api = {
    Auth: auth,
    EmployeeManage: emgr,
    TraderManage: tmgr,
    Stock: prod,
    Trade: trade
}