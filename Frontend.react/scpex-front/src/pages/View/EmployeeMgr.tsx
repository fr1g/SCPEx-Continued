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
import { getById } from "../../tools/misc";
import Button from "../../components/Fragments/Button";

export default function EmployeeMgr() {
    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [pageNum, setPageNum] = useState(0);
    const [generatedPassword, setGeneratedPassword] = useState<string>("");
    const { userInfo }: { userInfo: UserCredential | null } = useSelector(
        (s: any) => s.auth,
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 初始化一个空的员工对象
    const createEmptyEmployee = () => {
        const now = new Date();
        return new Employee(
            "", // jobTitle
            0, // id 新员工id应该为0，后端会自动生成
            "", // name
            "", // contact
            UserType.REGISTRAR, // type
            GeneralStatus.PENDING, // status
            now.getTime(), // createdDate - 使用时间戳
            now.getTime(), // birth - 使用时间戳
            "", // passwd
            "", // note
        );
    };

    async function refresh(page = 0) {
        if (!userInfo) return;

        const pr = new PageRequest();
        pr.PageSize = 10;
        try {
            const result = await api.EmployeeManage.getListedEmployees(
                userInfo.token,
                pr,
                page,
            );
            if (result.code === 200 && result.content) {
                const rawPageData = JSON.parse(result.content) as Pageable;

                // 转换员工状态和类型字符串为枚举值
                const convertedContent = rawPageData.content.map((emp: any) => {
                    // 状态转换
                    if (typeof emp.status === "string") {
                        switch (emp.status) {
                            case "PENDING":
                                emp.status = GeneralStatus.PENDING;
                                break;
                            case "APPROVED":
                                emp.status = GeneralStatus.APPROVED;
                                break;
                            case "REJECTED":
                                emp.status = GeneralStatus.REJECTED;
                                break;
                            case "ONTHEWAY":
                                emp.status = GeneralStatus.ONTHEWAY;
                                break;
                            case "CANCELED":
                                emp.status = GeneralStatus.CANCELED;
                                break;
                            case "FULFILLED":
                                emp.status = GeneralStatus.FULFILLED;
                                break;
                            default:
                                emp.status = GeneralStatus.UNKNOWN;
                                break;
                        }
                    }

                    // 用户类型转换
                    if (typeof emp.type === "string") {
                        switch (emp.type) {
                            case "DEFAULT":
                                emp.type = UserType.DEFAULT;
                                break;
                            case "SELLER":
                                emp.type = UserType.SELLER;
                                break;
                            case "CUSTOMER":
                                emp.type = UserType.CUSTOMER;
                                break;
                            case "ADMIN":
                                emp.type = UserType.ADMIN;
                                break;
                            case "WAREHOUSE":
                                emp.type = UserType.WAREHOUSE;
                                break;
                            case "REGISTRAR":
                                emp.type = UserType.REGISTRAR;
                                break;
                            default:
                                emp.type = UserType.DEFAULT;
                                break;
                        }
                    }

                    return emp;
                });

                setPageContent({
                    ...rawPageData,
                    content: convertedContent,
                });
            }
        } catch (error: any) {
            if (error.message.includes("401")) {
                doInvalidCredentialAction(dispatch, navigate);
            } else console.error("加载员工数据失败:", error);
        }
    }

    function getNewPage(inPageNum: number) {
        setPageNum(inPageNum);
        refresh(inPageNum);
    }

    function innerClickHandler(e: any) {
        let clickedItemId = parseInt(e.nativeEvent.target.id!);
        const selectedEmployee = getById(clickedItemId, pageContent!.content);
        if (selectedEmployee) {
            setCurrentEmployee(selectedEmployee);
        }
    }

    // 执行增删改操作
    async function performOperation(operation: "add" | "upd" | "del") {
        if (!userInfo) {
            alert("用户未登录");
            return;
        }

        if (!currentEmployee) {
            alert("请先填写员工信息");
            return;
        }

        try {
            const employeeToSend = { ...currentEmployee };

            // 对于添加操作，确保id为null
            if (operation === "add") {
                employeeToSend.id = 0; // 后端要求新员工id必须为0或null
            }

            // 将日期转换为时间戳，因为后端期望数字格式
            if (employeeToSend.createdDate instanceof Date) {
                employeeToSend.createdDate = employeeToSend.createdDate.getTime();
            } else if (typeof employeeToSend.createdDate === "string") {
                employeeToSend.createdDate = new Date(
                    employeeToSend.createdDate,
                ).getTime();
            }

            if (employeeToSend.birth instanceof Date) {
                employeeToSend.birth = employeeToSend.birth.getTime();
            } else if (typeof employeeToSend.birth === "string") {
                employeeToSend.birth = new Date(employeeToSend.birth).getTime();
            }

            const op = new Operation(operation, JSON.stringify(employeeToSend));
            const result = await api.EmployeeManage.EmployeeOperate(
                userInfo.token,
                op,
            );

            if (result.code === 200) {
                // 如果是添加员工且后端返回了生成的密码
                if (operation === "add" && result.content) {
                    try {
                        const newEmployee = JSON.parse(result.content);
                        if (newEmployee.passwd) {
                            setGeneratedPassword(newEmployee.passwd);
                            alert(`员工添加成功！生成的密码是: ${newEmployee.passwd}`);
                        }
                    } catch (e) {
                        // 如果解析失败，仍然显示成功消息
                        alert("员工添加成功！");
                    }
                } else {
                    alert("操作成功！");
                }

                refresh(pageNum);
                if (operation === "add") {
                    setCurrentEmployee(createEmptyEmployee());
                }
            } else {
                alert(`操作失败: ${result.title || "未知错误"}`);
            }
        } catch (error: any) {
            console.error("操作失败:", error);
            alert(`操作失败: ${error.message || "未知错误"}`);
        }
    }

    // 重置密码功能
    async function resetPassword() {
        if (!userInfo) {
            alert("用户未登录");
            return;
        }

        if (!currentEmployee || !currentEmployee.id) {
            alert("请先选择一个员工");
            return;
        }

        try {
            // 根据提示，重置密码需要传入"e"指定是员工
            const result = await api.Auth.resetPasswd(
                userInfo.token,
                currentEmployee.id,
                "e",
            );

            if (result.code === 200 && result.content) {
                const newPassword = result.content;
                setGeneratedPassword(newPassword);
                alert(`密码重置成功！新密码是: ${newPassword}`);
            } else {
                alert(`重置密码失败: ${result.title || "未知错误"}`);
            }
        } catch (error: any) {
            console.error("重置密码失败:", error);
            alert(`重置密码失败: ${error.message || "未知错误"}`);
        }
    }

    useEffect(() => {
        if (!userInfo) {
            navigate("/auth/login");
            return;
        }

        if (isCredTrader(userInfo)) insufficientHandler(navigate);

        refresh();
        setCurrentEmployee(createEmptyEmployee());
    }, [userInfo, navigate]);

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

                    <div className="flex gap-2 mt-4 flex-wrap">
                        <Button
                            onClick={() => performOperation("add")}
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            添加员工
                        </Button>
                        <Button
                            onClick={() => performOperation("upd")}
                            className="bg-yellow-500 text-white hover:bg-yellow-600"
                            disable={!currentEmployee?.id}
                        >
                            更新员工
                        </Button>
                        <Button
                            onClick={resetPassword}
                            className="bg-purple-500 text-white hover:bg-purple-600"
                            disable={!currentEmployee?.id}
                        >
                            重置密码
                        </Button>
                        <Button
                            onClick={() => setCurrentEmployee(createEmptyEmployee())}
                            className="bg-gray-500 text-white hover:bg-gray-600"
                        >
                            清空表单
                        </Button>
                    </div>

                    {generatedPassword && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
                            <p className="text-green-700">
                                <strong>生成的密码：</strong> {generatedPassword}
                            </p>
                        </div>
                    )}
                </div>

                {/* 员工列表 */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">员工列表</h2>
                    <Button
                        onClick={() => refresh(pageNum)}
                        className="mb-2 bg-blue-500 text-white hover:bg-blue-600"
                    >
                        刷新列表
                    </Button>
                    <PageableList
                        page={pageContent}
                        askNewPage={getNewPage}
                        contentClickEvent={innerClickHandler}
                    />
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
