import { useEffect, useState } from "react";
import PageableList from "../../components/PageableList";
import Pageable from "../../models/Pageable";
import { useDispatch, useSelector } from "react-redux";
import {
  doInvalidCredentialAction,
  insufficientHandler,
  isCredTrader,
} from "../../tools/AuthTools";
import { UserCredential } from "../../models/UserCredential";
import { useNavigate } from "react-router";
import PageRequest from "../../models/PageRequest";
import { api } from "../../axios";
import Employee from "../../models/UserType/Employee";
import { Input } from "@headlessui/react";
import { inputClassNames } from "../../env";
import { Operation } from "../../models/Operation";
import { UserType, GeneralStatus } from "../../models/GeneralEnum";

export default function EmployeeMgr() {
  const [pageContent, setPageContent] = useState<Pageable | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const { userInfo }: { userInfo: UserCredential } = useSelector(
    (s: any) => s.auth,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 初始化一个空的员工对象
  const createEmptyEmployee = () => {
    return new Employee(
      "", // jobTitle
      0, // id
      "", // name
      "", // contact
      UserType.REGISTRAR, // type
      GeneralStatus.PENDING, // status
      new Date(), // createdDate
      new Date(), // birth
      "", // passwd
      "", // note
    );
  };

  async function refresh(page = 0) {
    let pr = new PageRequest();
    try {
      const result = await api.EmployeeManage.getListedEmployees(
        userInfo.token,
        pr,
        page,
      );
      if (result.status === 200 && result.content) {
        const pageData = JSON.parse(result.content) as Pageable;
        setPageContent(pageData);
      }
    } catch (error: any) {
      if (error.message.includes("401")) {
        doInvalidCredentialAction(dispatch, navigate);
      } else console.error("加载员工数据失败:", error);
    }
  }

  // 执行增删改操作
  async function performOperation(operation: "add" | "upd" | "del") {
    if (!currentEmployee) {
      alert("请先填写员工信息");
      return;
    }

    try {
      const op = new Operation(operation, JSON.stringify(currentEmployee));
      const result = await api.EmployeeManage.EmployeeOperate(
        userInfo.token,
        op,
      );

      if (result.status === 200) {
        alert("操作成功！");
        refresh();
        if (operation === "add") {
          setCurrentEmployee(createEmptyEmployee());
        }
      } else {
        alert(`操作失败: ${result.message || "未知错误"}`);
      }
    } catch (error: any) {
      console.error("操作失败:", error);
      alert(`操作失败: ${error.message || "未知错误"}`);
    }
  }

  useEffect(() => {
    if (isCredTrader(userInfo)) insufficientHandler(navigate);

    refresh();
    setCurrentEmployee(createEmptyEmployee());
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold">员工管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* 员工信息表单 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">员工信息</h2>
          <div className="space-y-3">
            <Input
              className={inputClassNames}
              placeholder="员工ID"
              type="number"
              value={currentEmployee?.id || ""}
              onChange={e =>
                setCurrentEmployee(prev =>
                  prev ? { ...prev, id: parseInt(e.target.value) || 0 } : null,
                )
              }
            />
            <Input
              className={inputClassNames}
              placeholder="姓名"
              type="text"
              value={currentEmployee?.name || ""}
              onChange={e =>
                setCurrentEmployee(prev =>
                  prev ? { ...prev, name: e.target.value } : null,
                )
              }
            />
            <Input
              className={inputClassNames}
              placeholder="联系方式"
              type="text"
              value={currentEmployee?.contact || ""}
              onChange={e =>
                setCurrentEmployee(prev =>
                  prev ? { ...prev, contact: e.target.value } : null,
                )
              }
            />
            <Input
              className={inputClassNames}
              placeholder="职位"
              type="text"
              value={currentEmployee?.jobTitle || ""}
              onChange={e =>
                setCurrentEmployee(prev =>
                  prev ? { ...prev, jobTitle: e.target.value } : null,
                )
              }
            />
            <Input
              className={inputClassNames}
              placeholder="密码"
              type="password"
              value={
                currentEmployee?.passwd === "hidden"
                  ? ""
                  : currentEmployee?.passwd || ""
              }
              onChange={e =>
                setCurrentEmployee(prev =>
                  prev ? { ...prev, passwd: e.target.value } : null,
                )
              }
            />
            <Input
              className={inputClassNames}
              placeholder="备注"
              type="text"
              value={currentEmployee?.note || ""}
              onChange={e =>
                setCurrentEmployee(prev =>
                  prev ? { ...prev, note: e.target.value } : null,
                )
              }
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => performOperation("add")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              添加员工
            </button>
            <button
              onClick={() => performOperation("upd")}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              disabled={!currentEmployee?.id}
            >
              更新员工
            </button>
            <button
              onClick={() => performOperation("del")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={!currentEmployee?.id}
            >
              删除员工
            </button>
            <button
              onClick={() => setCurrentEmployee(createEmptyEmployee())}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              清空表单
            </button>
          </div>
        </div>

        {/* 员工列表 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">员工列表</h2>
          <button
            onClick={() => refresh()}
            className="mb-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            刷新列表
          </button>
          <PageableList page={pageContent} />
        </div>
      </div>

      {/* 当前员工信息调试显示 */}
      <div className="mt-6">
        <details>
          <summary className="cursor-pointer text-sm text-gray-600">
            调试信息
          </summary>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(currentEmployee, null, 2)}
          </pre>
        </details>
      </div>
    </>
  );
}
