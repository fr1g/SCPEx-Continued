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
import Trader from "../../models/UserType/Trader";
import { Input } from "@headlessui/react";
import { inputClassNames } from "../../env";
import { Operation } from "../../models/Operation";
import { UserType, GeneralStatus } from "../../models/GeneralEnum";

export default function TraderMgr() {
    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [currentTrader, setCurrentTrader] = useState<Trader | null>(null);
    const { userInfo }: { userInfo: UserCredential } = useSelector(
        (s: any) => s.auth,
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 初始化一个空的用户对象
    const createEmptyTrader = () => {
        const now = new Date();
        let nt = new Trader(
            0, // id
            "", // name
            "", // contact
            UserType.CUSTOMER, // type
            GeneralStatus.PENDING, // status
            now.getTime(), // createdDate - 使用时间戳
            now.getTime(), // birth - 使用时间戳
            "", // passwd
            0, // registrar - TODO may cause error, let's bless the backend
            "", // note
        );
        nt.locationJson = "";
        nt.preferJson = "";


        return nt;
    };

    async function refresh(page = 0) {
        const pr = new PageRequest();
        try {
            const result = await api.TraderManage.getListedTraders(
                userInfo.token,
                pr,
                page,
            );
            if (result.code === 200 && result.content) {
                const rawPageData = JSON.parse(result.content) as Pageable;

                // 转换用户状态和类型字符串为枚举值
                const convertedContent = rawPageData.content.map((trader: any) => {
                    // 状态转换
                    if (typeof trader.status === "string") {
                        switch (trader.status) {
                            case "PENDING":
                                trader.status = GeneralStatus.PENDING;
                                break;
                            case "APPROVED":
                                trader.status = GeneralStatus.APPROVED;
                                break;
                            case "REJECTED":
                                trader.status = GeneralStatus.REJECTED;
                                break;
                            case "ONTHEWAY":
                                trader.status = GeneralStatus.ONTHEWAY;
                                break;
                            case "CANCELED":
                                trader.status = GeneralStatus.CANCELED;
                                break;
                            case "FULFILLED":
                                trader.status = GeneralStatus.FULFILLED;
                                break;
                            default:
                                trader.status = GeneralStatus.UNKNOWN;
                                break;
                        }
                    }

                    // 用户类型转换
                    if (typeof trader.type === "string") {
                        switch (trader.type) {
                            case "DEFAULT":
                                trader.type = UserType.DEFAULT;
                                break;
                            case "SELLER":
                                trader.type = UserType.SELLER;
                                break;
                            case "CUSTOMER":
                                trader.type = UserType.CUSTOMER;
                                break;
                            case "ADMIN":
                                trader.type = UserType.ADMIN;
                                break;
                            case "WAREHOUSE":
                                trader.type = UserType.WAREHOUSE;
                                break;
                            case "REGISTRAR":
                                trader.type = UserType.REGISTRAR;
                                break;
                            default:
                                trader.type = UserType.DEFAULT;
                                break;
                        }
                    }

                    return trader;
                });

                setPageContent({
                    ...rawPageData,
                    content: convertedContent,
                });
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes("401")) {
                doInvalidCredentialAction(dispatch, navigate);
            } else console.error("加载用户数据失败:", error);
        }
    }

    // 执行增删改操作
    async function performOperation(operation: "add" | "upd" | "del") {
        if (!currentTrader) {
            alert("请先填写用户信息");
            return;
        }

        try {
            const traderToSend = { ...currentTrader };

            // 对于添加操作，确保id为0
            if (operation === "add") {
                traderToSend.id = 0;
            }

            // 将日期转换为时间戳，因为后端期望数字格式
            if (traderToSend.createdDate instanceof Date) {
                traderToSend.createdDate = traderToSend.createdDate.getTime();
            } else if (typeof traderToSend.createdDate === "string") {
                traderToSend.createdDate = new Date(traderToSend.createdDate).getTime();
            }

            if (traderToSend.birth instanceof Date) {
                traderToSend.birth = traderToSend.birth.getTime();
            } else if (typeof traderToSend.birth === "string") {
                traderToSend.birth = new Date(traderToSend.birth).getTime();
            }

            const op = new Operation(operation, JSON.stringify(traderToSend));
            const result = await api.TraderManage.traderOperate(userInfo.token, op);

            if (result.code === 200) {
                alert("操作成功！");
                refresh();
                if (operation === "add") {
                    setCurrentTrader(createEmptyTrader());
                }
            } else {
                alert(`操作失败: ${result.title || "未知错误"}`);
            }
        } catch (error: unknown) {
            console.error("操作失败:", error);
            alert(`操作失败: ${error instanceof Error ? error.message : "未知错误"}`);
        }
    }

    useEffect(() => {
        if (isCredTrader(userInfo)) insufficientHandler(navigate);

        refresh();
        setCurrentTrader(createEmptyTrader());
    }, []);

    return (
        <>
            <h1 className="text-3xl font-semibold">用户管理</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* 用户信息表单 */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">用户信息</h2>
                    <div className="space-y-3">
                        <Input
                            className={inputClassNames}
                            placeholder="用户ID"
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
                            placeholder="姓名"
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
                            placeholder="联系方式"
                            type="text"
                            value={currentTrader?.contact || ""}
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, contact: e.target.value } : null,
                                )
                            }
                        />
                        <select
                            className={inputClassNames}
                            value={currentTrader?.type || UserType.CUSTOMER}
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, type: parseInt(e.target.value) } : null,
                                )
                            }
                        >
                            <option value={UserType.CUSTOMER}>客户</option>
                            <option value={UserType.SELLER}>卖家</option>
                        </select>
                        <Input
                            className={inputClassNames}
                            placeholder="密码"
                            type="password"
                            value={
                                currentTrader?.passwd === "hidden"
                                    ? ""
                                    : currentTrader?.passwd || ""
                            }
                            onChange={e =>
                                setCurrentTrader(prev =>
                                    prev ? { ...prev, passwd: e.target.value } : null,
                                )
                            }
                        />
                        <Input
                            className={inputClassNames}
                            placeholder="备注"
                            type="text"
                            value={currentTrader?.note || ""}
                            onChange={e =>
                                setCurrentTrader(prev =>
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
                            添加用户
                        </button>
                        <button
                            onClick={() => performOperation("upd")}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            disabled={!currentTrader?.id}
                        >
                            更新用户
                        </button>
                        <button
                            onClick={() => setCurrentTrader(createEmptyTrader())}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            清空表单
                        </button>
                    </div>
                </div>

                {/* 用户列表 */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">用户列表</h2>
                    <button
                        onClick={() => refresh()}
                        className="mb-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        刷新列表
                    </button>
                    <PageableList page={pageContent} />
                </div>
            </div>

            {/* 当前用户信息调试显示 */}
            <div className="mt-6">
                <details>
                    <summary className="cursor-pointer text-sm text-gray-600">
                        调试信息
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                        {JSON.stringify(currentTrader, null, 2)}
                    </pre>
                </details>
            </div>
        </>
    );
}
