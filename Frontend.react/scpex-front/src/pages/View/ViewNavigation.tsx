import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { UserCredential } from "../../models/UserCredential";
import { isOneOf } from "../../tools/misc";

export default function ViewNavigation() {
    const location = useLocation();

    const {userInfo} : {userInfo: UserCredential} = useSelector((s: any) => s.auth );

    const navItems = [
        (isOneOf(userInfo.userClass, [ 'warehouse', 'admin', ]) && { path: "/view/warehouse", label: "货物管理" }),
        (isOneOf(userInfo.userClass, [ 'admin', ]) && { path: "/view/employee-management", label: "员工管理" }),
        (isOneOf(userInfo.userClass, [ 'admin', ]) && { path: "/view/trader-management", label: "用户管理" }),
        (isOneOf(userInfo.userClass, [ 'customer', ]) && { path: "/view/cart-management", label: "购物车管理" }),
        (isOneOf(userInfo.userClass, [ 'warehouse', 'admin', 'seller']) && { path: "/view/contract-negotiations", label: "合同谈判" }),
        (isOneOf(userInfo.userClass, [ 'customer', ]) && { path: "/view/address-book", label: "地址簿" }),
        (isOneOf(userInfo.userClass, [ 'warehouse', 'customer', 'admin' ]) && { path: "/view/trades-tracker", label: "交易跟踪" }),
    ];

    return (
        <nav className="bg-gray-100 dark:bg-gray-400/20 p-4 mb-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Managements</h2>
            <div className="flex flex-wrap gap-2">
                {navItems.map(item => item ? (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`px-3 py-2 rounded transition-colors ${location.pathname === item.path
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {item.label}
                    </Link>
                ) : '')}
            </div>
        </nav>
    );
}
