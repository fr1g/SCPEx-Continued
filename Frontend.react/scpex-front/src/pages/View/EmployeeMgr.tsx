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
import Selectable from "../../models/Selectable";
import WrappedComboBox from "../../components/WrappedComboBox";

export default function EmployeeMgr() {
    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [pageNum, setPageNum] = useState(0);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>("");
    const { userInfo }: { userInfo: UserCredential | null } = useSelector(
        (s: any) => s.auth,
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedType, setSelectedType] = useState<UserType.ADMIN | UserType.REGISTRAR | UserType.WAREHOUSE | UserType.DEFAULT>(UserType.DEFAULT)

    const selectableTypes: Selectable[] = [
        new Selectable(0, "default", UserType.DEFAULT),
        new Selectable(1, "Admin", UserType.ADMIN),
        new Selectable(2, "Warehouse", UserType.WAREHOUSE),
        new Selectable(3, "reg", UserType.REGISTRAR),

    ]

    // 初始化一个空的员工对象
    const createEmptyEmployee = () => {
        const now = new Date();
        return new Employee(
            "", // jobTitle
            0, // id 新员工id应该为0，后端会自动生成
            "", // name
            "", // contact
            selectedType, // type
            GeneralStatus.APPROVED, // status
            now.getTime(), // createdDate - 使用时间戳
            now.getTime(), // birth - 使用时间戳
            "", // passwd
            "", // note
        );
    };

    async function refresh(page = 0) {
        if (!userInfo) return;

        const pr = new PageRequest();
        pr.PageSize = 5;
        try {
            const result = await api.EmployeeManage.getListedEmployees(
                userInfo.token,
                pr,
                page,
            );
            if (result.code === 200 && result.content) {
                const rawPageData = JSON.parse(result.content) as Pageable;

                const convertedContent = rawPageData.content.map((emp: any) => {
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
            } else console.error("FAILED:", error);
        }
    }

    function getNewPage(inPageNum: number) {
        setPageNum(inPageNum);
        refresh(inPageNum);
    }

    function innerClickHandler(e: any) {
        setGeneratedPassword(null);
        let clickedItemId = parseInt(e.nativeEvent.target.id!);
        const selectedEmployee = getById(clickedItemId, pageContent!.content);
        if (selectedEmployee) {
            setCurrentEmployee(selectedEmployee);
        }
    }

    // 执行增删改OP 
    async function performOperation(operation: "add" | "upd") {
        if (!userInfo) {
            alert("...");
            return;
        }

        if (!currentEmployee) {
            alert("Insert some info first");
            return;
        }

        try {
            const employeeToSend = { ...currentEmployee };

            // 对于添加OP ，确保id为null
            if (operation === "add") {
                employeeToSend.id = null;
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

            if (employeeToSend.contact == "" || employeeToSend.name == "") throw new Error("Need CONTACT and NAME")

            employeeToSend.type = selectedType;
            const op = new Operation(operation, JSON.stringify(employeeToSend));
            const result = await api.EmployeeManage.EmployeeOperate(
                userInfo.token,
                op,
            );

            if (result.code === 200) {
                // 如果是添加员工且后端返回了生成的 PASSWD 
                if (operation === "add" && result.content) {
                    try {
                        const newEmployee = JSON.parse(result.content);
                        if (newEmployee.passwd) {
                            setGeneratedPassword(newEmployee.passwd);
                            alert(`MGR: success: Generated Passwd: ${newEmployee.passwd}`);
                        }
                    } catch (e) {
                        alert("MGR: success");
                    }
                } else {
                    alert("OP success");
                }

                refresh(pageNum);
                if (operation === "add") {
                    setCurrentEmployee(createEmptyEmployee());
                }
            } else {
                alert(`OP FAILED1: ${result.title || "unknown"}`);
            }
        } catch (error: any) {
            console.error("OP FAILED:", error);
            alert(`Error: ${error.message || "unknown"} ... Maybe missing necessary data`);
        }
    }

    // reset  PASSWD 功能
    async function resetPassword() {
        if (!userInfo) {
            alert("...");
            return;
        }

        if (!currentEmployee || !currentEmployee.id) {
            alert("Select one first");
            return;
        }

        try {
            const result = await api.Auth.resetPasswd(
                userInfo.token,
                currentEmployee.id,
                "e",
            );

            if (result.code === 200 && result.content) {
                const newPassword = result.title;
                console.log(result)
                setGeneratedPassword(newPassword);
                alert(` PASSWD RESET: ${newPassword}`);
            } else {
                alert(`failed to reset passwd: ${result.title || "unknown"}`);
            }
        } catch (error: any) {
            console.error("reset  PASSWD FAILED:", error);
            alert(`reset  PASSWD FAILED: ${error.message || "unknown"}`);
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

    function revealSelectable(infox: any) {
        for (let r of selectableTypes) {
            if (r.info! == infox) return r
        }
        return selectableTypes[0];
    }

    return (
        <>
            <h1 className="text-3xl font-semibold">Empl Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div>
                    <h2 className="text-xl font-semibold mb-4">info</h2>
                    <div className="space-y-3">
                        <Input
                            className={inputClassNames}
                            placeholder="ID"
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
                            placeholder="name"
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
                            placeholder="contact"
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
                            placeholder="job title"
                            type="text"
                            value={currentEmployee?.jobTitle || ""}
                            onChange={e =>
                                setCurrentEmployee(prev =>
                                    prev ? { ...prev, jobTitle: e.target.value } : null,
                                )
                            }
                        />
                        <p>
                            Current type: {currentEmployee ? UserType[currentEmployee.type] : ''}
                        </p>
                        <WrappedComboBox
                            className="w-full! m-0!"
                            enums={selectableTypes}
                            selectedIndex={selectableTypes.indexOf(revealSelectable(selectedType))}
                            onChange={(was: any, val: Selectable) => {
                                (was: any) => was;
                                setSelectedType(val.info!)
                            }}
                        />
                        <Input
                            className={inputClassNames}
                            placeholder="note"
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
                        <Button paddingless
                            onClick={() => performOperation("add")}
                            className="bg-green-500 text-white hover:bg-green-600 px-3 py-2"
                        >
                            Add
                        </Button>
                        <Button paddingless
                            onClick={() => performOperation("upd")}
                            className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-2"
                            disable={!currentEmployee?.id}
                        >
                            Update
                        </Button>
                        <Button paddingless
                            onClick={resetPassword}
                            className="bg-purple-500 text-white hover:bg-purple-600 px-3 py-2"
                            disable={!currentEmployee?.id}
                        >
                            reset  PASSWD
                        </Button>
                        <Button paddingless
                            onClick={() => {
                                setSelectedType(UserType.DEFAULT);
                                setCurrentEmployee(createEmptyEmployee());
                            }}
                            className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-2"
                        >
                            clear form
                        </Button>
                    </div>

                    {generatedPassword && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
                            <p className="text-green-700">
                                <strong>生成的 PASSWD ：</strong>
                                <Button onClick={() => { window.navigator.clipboard.writeText(generatedPassword) }} >{generatedPassword} (click to copy)</Button>
                            </p>
                        </div>
                    )}
                </div>

                {/* 员工列表 */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 clear-both">
                        List
                        <Button paddingless
                            onClick={() => refresh(pageNum)}
                            className="mb-2 bg-blue-500 text-white hover:bg-blue-600 float-right text-base! font-medium!"
                        >
                            refresh
                        </Button>
                    </h2>

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
                        debug
                    </summary>
                    <pre className="text-xs bg-gray-100/20 p-2 rounded mt-2">
                        {JSON.stringify(currentEmployee, null, 2)}
                    </pre>
                </details>
            </div>
        </>
    );
}
