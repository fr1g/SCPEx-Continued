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

import Button from "../../components/Fragments/Button";
import { getById } from "../../tools/misc";

interface Trade {
    id: number;
    status: string;
    dateCreated: string;
    dateUpdated: string;
    totalPrice: number;
    trader?: {
        id: number;
        name: string;
        contact: string;
    };
    transactions?: Transaction[];
}

interface Transaction {
    id: number;
    status: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product?: {
        id: number;
        name: string;
        description: string;
    };
}

export default function OrderTracker() {
    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);
    const [pageNum, setPageNum] = useState(0);
    const [loading, setLoading] = useState(false);

    const { userInfo }: { userInfo: UserCredential | null } = useSelector(
        (s: any) => s.auth,
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function refresh(page = 0) {
        if (!userInfo) return;

        const pr = new PageRequest();
        pr.PageSize = 10;
        try {
            setLoading(true);

            // 调用现有的getTrades API
            const result = await api.Trade.getTrades(page, pr, userInfo.token);

            if (result.code === 200 && result.content) {
                const pageData = JSON.parse(result.content) as Pageable;
                setPageContent(pageData);
            }
        } catch (error: any) {
            if (error.message.includes("401")) {
                doInvalidCredentialAction(dispatch, navigate);
            } else {
                console.error("加载订单数据失败:", error);
            }
        } finally {
            setLoading(false);
        }
    }

    function getNewPage(inPageNum: number) {
        setPageNum(inPageNum);
        refresh(inPageNum);
    }

    function innerClickHandler(e: any) {
        const clickedItemId = parseInt(e.nativeEvent.target.id!);
        const selectedTradeItem = getById(clickedItemId, pageContent!.content);
        if (selectedTradeItem) {
            setSelectedTrade(selectedTradeItem);
            setSelectedTransaction(null); // 清空已选择的交易明细
        }
    }

    async function updateTransactionStatus(
        transactionId: number,
        newStatus: string,
    ) {
        if (!userInfo) {
            alert("用户未登录");
            return;
        }

        if (!selectedTransaction) {
            alert("请先选择一个交易明细");
            return;
        }

        try {
            const updatedTransaction = {
                ...selectedTransaction,
                status: newStatus,
            };

            const result = await api.Trade.updateTransaction(
                userInfo.token,
                transactionId,
                updatedTransaction,
            );

            if (result.code === 200) {
                alert("状态更新成功！");
                refresh(pageNum);
                // 刷新选中的订单详情
                if (selectedTrade) {
                    // 重新获取订单详情或更新本地状态
                    const updatedTrade = { ...selectedTrade };
                    if (updatedTrade.transactions) {
                        const transactionIndex = updatedTrade.transactions.findIndex(
                            t => t.id === transactionId,
                        );
                        if (transactionIndex >= 0) {
                            updatedTrade.transactions[transactionIndex].status = newStatus;
                            setSelectedTrade(updatedTrade);
                        }
                    }
                }
            } else {
                alert(`状态更新失败: ${result.title || "未知错误"}`);
            }
        } catch (error: any) {
            console.error("更新状态失败:", error);
            alert(`状态更新失败: ${error.message || "未知错误"}`);
        }
    }

    const statusOptions = [
        { value: "PENDING", label: "待处理" },
        { value: "APPROVED", label: "已确认" },
        { value: "ONTHEWAY", label: "运输中" },
        { value: "FULFILLED", label: "已完成" },
        { value: "CANCELED", label: "已取消" },
        { value: "REJECTED", label: "已拒绝" },
    ];

    const getStatusLabel = (status: string) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.label : status;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-yellow-600 bg-yellow-100";
            case "APPROVED":
                return "text-blue-600 bg-blue-100";
            case "ONTHEWAY":
                return "text-purple-600 bg-purple-100";
            case "FULFILLED":
                return "text-green-600 bg-green-100";
            case "CANCELED":
            case "REJECTED":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/auth/login");
            return;
        }

        // 检查权限：只有仓库人员、客户和管理员可以访问
        if (
            !isCredTrader(userInfo) &&
            !["warehouse", "admin", "customer"].includes(userInfo.userClass)
        ) {
            insufficientHandler(navigate);
            return;
        }

        refresh();
    }, [userInfo, navigate]);

    return (
        <>
            <h1 className="text-3xl font-semibold">订单追踪</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
                {/* 订单列表 */}
                <div className="xl:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">订单列表</h2>
                        <Button
                            onClick={() => refresh(pageNum)}
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            disable={loading}
                        >
                            {loading ? "加载中..." : "刷新"}
                        </Button>
                    </div>

                    <PageableList
                        page={pageContent}
                        askNewPage={getNewPage}
                        contentClickEvent={innerClickHandler}
                    />
                </div>

                {/* 订单详情 */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">订单详情</h2>
                    {selectedTrade ? (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">订单信息</h3>
                                <div className="space-y-1 text-sm">
                                    <p>
                                        <strong>订单ID:</strong> {selectedTrade.id}
                                    </p>
                                    <p>
                                        <strong>状态:</strong>
                                        <span
                                            className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                                                selectedTrade.status,
                                            )}`}
                                        >
                                            {getStatusLabel(selectedTrade.status)}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>总金额:</strong> ¥
                                        {selectedTrade.totalPrice?.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>创建时间:</strong>{" "}
                                        {new Date(selectedTrade.dateCreated).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>更新时间:</strong>{" "}
                                        {new Date(selectedTrade.dateUpdated).toLocaleString()}
                                    </p>
                                    {selectedTrade.trader && (
                                        <>
                                            <p>
                                                <strong>客户:</strong> {selectedTrade.trader.name}
                                            </p>
                                            <p>
                                                <strong>联系方式:</strong>{" "}
                                                {selectedTrade.trader.contact}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* 交易明细 */}
                            {selectedTrade.transactions &&
                                selectedTrade.transactions.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">交易明细</h3>
                                        <div className="space-y-2">
                                            {selectedTrade.transactions.map(transaction => (
                                                <div
                                                    key={transaction.id}
                                                    className={`p-3 rounded border cursor-pointer transition-colors ${selectedTransaction?.id === transaction.id
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => setSelectedTransaction(transaction)}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-medium text-sm">
                                                            {transaction.product?.name ||
                                                                `商品ID: ${transaction.id}`}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                                                transaction.status,
                                                            )}`}
                                                        >
                                                            {getStatusLabel(transaction.status)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        <p>
                                                            数量: {transaction.quantity} | 单价: ¥
                                                            {transaction.unitPrice?.toFixed(2)} | 小计: ¥
                                                            {transaction.totalPrice?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* 状态更新操作 - 只有管理员和仓库人员可以操作 */}
                            {userInfo && !isCredTrader(userInfo) && selectedTransaction && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">更新状态</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {statusOptions.map(option => (
                                            <Button
                                                key={option.value}
                                                onClick={() =>
                                                    updateTransactionStatus(
                                                        selectedTransaction.id,
                                                        option.value,
                                                    )
                                                }
                                                className={`text-sm ${selectedTransaction.status === option.value
                                                        ? "bg-gray-400 text-white"
                                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                                    }`}
                                                disable={selectedTransaction.status === option.value}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center py-8">
                            点击左侧订单查看详情
                        </div>
                    )}
                </div>
            </div>

            {/* 调试信息 */}
            <div className="mt-6">
                <details>
                    <summary className="cursor-pointer text-sm text-gray-600">
                        调试信息
                    </summary>
                    <div className="mt-2 space-y-2">
                        <div>
                            <p className="text-xs font-semibold">选中的订单:</p>
                            <pre className="text-xs bg-gray-100 p-2 rounded">
                                {selectedTrade ? JSON.stringify(selectedTrade, null, 2) : "无"}
                            </pre>
                        </div>
                        <div>
                            <p className="text-xs font-semibold">选中的交易明细:</p>
                            <pre className="text-xs bg-gray-100 p-2 rounded">
                                {selectedTransaction
                                    ? JSON.stringify(selectedTransaction, null, 2)
                                    : "无"}
                            </pre>
                        </div>
                    </div>
                </details>
            </div>
        </>
    );
}
