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
import { Input } from "@headlessui/react";
import { inputClassNames } from "../../env";
import { Operation } from "../../models/Operation";
import { UserType, GeneralStatus } from "../../models/GeneralEnum";
import { getById } from "../../tools/misc";
import Button from "../../components/Fragments/Button";
import Trader from "../../models/UserType/Trader";
import Employee from "../../models/UserType/Employee";

export default function TraderMgr() {
    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [currentTrader, setCurrentTrader] = useState<Trader | null>(null);
    const [pageNum, setPageNum] = useState(0);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>("");
    const { userInfo }: { userInfo: UserCredential | null } = useSelector(
        (s: any) => s.auth,
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createEmptyTrader = () => {
        const now = new Date();
        return new Trader(
            0,
            "", // name
            "", // contact
            UserType.REGISTRAR, // type
            GeneralStatus.APPROVED, // status
            now.getTime(), // createdDate - 使用时间戳
            now.getTime(), // birth - 使用时间戳
            "", // passwd
            1,
            "", // note
        );
    };

    async function refresh(page = 0) {
        if (!userInfo) return;

        const pr = new PageRequest();
        pr.PageSize = 10;
        try {
            const result = await api.TraderManage.getListedTraders(
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
        const selectedTrader = getById(clickedItemId, pageContent!.content);
        if (selectedTrader) {
            setCurrentTrader(selectedTrader);
        }
    }

    // 执行增删改OP 
    async function performOperation(operation: "upd" | "del") {
        if (!userInfo) {
            alert("用户未登录");
            return;
        }

        if (!currentTrader) {
            alert("请先填写员工信息");
            return;
        }

        try {
            const traderToSend = { ...currentTrader };

            // 将日期转换为时间戳，因为后端期望数字格式
            if (traderToSend.createdDate instanceof Date) {
                traderToSend.createdDate = traderToSend.createdDate.getTime();
            } else if (typeof traderToSend.createdDate === "string") {
                traderToSend.createdDate = new Date(
                    traderToSend.createdDate,
                ).getTime();
            }

            if (traderToSend.birth instanceof Date) {
                traderToSend.birth = traderToSend.birth.getTime();
            } else if (typeof traderToSend.birth === "string") {
                traderToSend.birth = new Date(traderToSend.birth).getTime();
            }

            if (traderToSend.contact == "" || traderToSend.name == "") throw new Error("Need CONTACT and NAME");
            traderToSend.registrar = (traderToSend.registrar as unknown as Employee).id ?? 1;
            console.log(traderToSend)
            const op = new Operation(operation, JSON.stringify(traderToSend));
            const result = await api.TraderManage.traderOperate(
                userInfo.token,
                op,
            );

            if (result.code === 200) {
                // 如果是添加员工且后端返回了生成的 PASSWD 

                alert("OP success");


                refresh(pageNum);

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
            alert("用户未登录");
            return;
        }

        if (!currentTrader || !currentTrader.id) {
            alert("请先选择一个员工");
            return;
        }

        try {
            // 根据提示，reset  PASSWD 需要传入"e"指定是员工
            const result = await api.Auth.resetPasswd(
                userInfo.token,
                currentTrader.id,
                "t",
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
        setCurrentTrader(createEmptyTrader());
    }, [userInfo, navigate]);

    return (
        <>
            <h1 className="text-3xl font-semibold">Trader management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* 员工信息表单 */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Info</h2>
                    <div className="space-y-3">
                        <Input
                            className={inputClassNames}
                            placeholder="ID"
                            type="number"
                            value={currentTrader?.id || ""}
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, id: parseInt(e.target.value) || 0 } : null,
                                )
                            }
                        />
                        <Input
                            className={inputClassNames}
                            placeholder="name"
                            type="text"
                            value={currentTrader?.name || ""}
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, name: e.target.value } : null,
                                )
                            }
                        />
                        <Input
                            className={inputClassNames}
                            placeholder="contact"
                            type="text"
                            value={currentTrader?.contact || ""}
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, contact: e.target.value } : null,
                                )
                            }
                        />
                        <Input
                            className={inputClassNames}
                            placeholder="note"
                            type="text"
                            value={currentTrader?.note || ""}
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, note: e.target.value } : null,
                                )
                            }
                        />
                    </div>

                    <div className="flex gap-2 mt-4 flex-wrap">
                        <Button paddingless
                            onClick={() => performOperation("upd")}
                            className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-2"
                            disable={!currentTrader?.id}
                        >
                            Update
                        </Button>
                        <Button paddingless
                            onClick={resetPassword}
                            className="bg-purple-500 text-white hover:bg-purple-600 px-3 py-2"
                            disable={!currentTrader?.id}
                        >
                            reset  PASSWD
                        </Button>
                        <Button paddingless
                            onClick={() => setCurrentTrader(createEmptyTrader())}
                            className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-2"
                        >
                            clear form
                        </Button>
                    </div>

                    {generatedPassword && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
                            <p className="text-green-700">
                                <strong>generated PASSWD ：</strong>
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
                    <pre className="text-xs bg-gray-100/10 p-2 rounded mt-2">
                        {JSON.stringify(currentTrader, null, 2)}
                    </pre>
                </details>
            </div>
        </>
    );
}
