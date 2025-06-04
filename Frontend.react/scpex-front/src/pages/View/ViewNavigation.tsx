import { Link, useLocation } from "react-router";

export default function ViewNavigation() {
  const location = useLocation();

  const navItems = [
    { path: "/view/warehouse", label: "货物管理" },
    { path: "/view/employee-management", label: "员工管理" },
    { path: "/view/trader-management", label: "用户管理" },
    { path: "/view/cart-management", label: "购物车管理" },
    { path: "/view/contract-negotiations", label: "合同谈判" },
    { path: "/view/address-book", label: "地址簿" },
    { path: "/view/trades-tracker", label: "交易跟踪" },
  ];

  return (
    <nav className="bg-gray-100 p-4 mb-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">管理面板</h2>
      <div className="flex flex-wrap gap-2">
        {navItems.map(item => ( 
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-2 rounded transition-colors ${
              location.pathname === item.path
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
