import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserCredential } from "../../models/UserCredential";
import { api } from "../../axios";
import PageRequest from "../../models/PageRequest";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Paper from "../../components/Fragments/Paper";
import { GeneralStatus, TradeStatus } from "../../models/GeneralEnum";
import { isCredTrader } from "../../tools/AuthTools";
import Button from "../../components/Fragments/Button";

interface Transaction {
    id: number;
    product: {
        id: number;
        name: string;
        category: {
            id: number;
            name: string;
            note: string;
            status: string;
        };
        status: string;
        singlePrice: number;
        amount: number;
        discount: number;
    };
    amount: number;
    price: number;
    discount: number;
    warehouse: string;
    logisticLink: string;
    status: string;
}

interface Trade {
    id: number;
    trader: {
        locationJson: string;
        registrar: {
            JobTitle: string;
            id: number;
            name: string;
            contact: string;
            type: string;
            status: string;
            birth: string;
            passwd: string;
            note: string;
        };
        preferJson: string;
        id: number;
        name: string;
        contact: string;
        type: string;
        status: string;
        birth: string;
        passwd: string;
    };
    status: string;
    dateCreated: string;
    totalPrice: number;
}

interface OrderItem {
    trade: Trade;
    transactions: Transaction[];
}

interface PageData {
    total: number;
    content: OrderItem[];
    pageable: {
        sort: {
            orders: {
                direction: string;
                property: string;
                ignoreCase: boolean;
                nullHandling: string;
            }[];
        };
        pageNumber: number;
        pageSize: number;
    };
}

export default function OrderTracker({ killPaperOutwrap }: { killPaperOutwrap?: boolean }) {
    const { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTrade, setSelectedTrade] = useState<OrderItem | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [stateControl, setStateControl] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders_ = async () => {
        try {
            const pageRequest = new PageRequest();
            pageRequest.PageSize = 10; // 设置每页显示一条数据
            const response = await api.Trade.getTrades(currentPage, pageRequest, userInfo.token);
            const data = JSON.parse(response.content) as PageData;
            setPageData(data);
            setStateControl(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setStateControl(true);
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const pageRequest = new PageRequest();
            pageRequest.PageSize = 10;
            const response = await api.Trade.getTrades(currentPage, pageRequest, userInfo.token);
            const data = JSON.parse(response.content) as PageData;
            
            // 强制更新选中订单的交易数据
            setPageData(prev => {
                if (prev && selectedTrade) {
                    const updatedContent = data.content.map(order => 
                        order.trade.id === selectedTrade.trade.id ? 
                        { ...order, transactions: data.content.find(o => o.trade.id === selectedTrade.trade.id)?.transactions || [] }
                        : order
                    );
                    return { ...data, content: updatedContent };
                }
                return data;
            });
            
            // 同步更新selectedTrade状态
            if (selectedTrade) {
                const freshTrade = data.content.find(t => t.trade.id === selectedTrade.trade.id);
                freshTrade && setSelectedTrade(freshTrade);
            }
            
            setStateControl(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setStateControl(true);
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!selectedOrder) return;
        try {
            await setTimeout(() => { }, 100);

            console.log(userInfo.token, selectedOrder.id, newStatus)
            await api.Trade.updateTransaction(userInfo.token, selectedOrder.id, newStatus);
            setIsStatusModalOpen(false);
            fetchOrders(); // 刷新订单列表
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case GeneralStatus.PENDING.toString():
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case GeneralStatus.APPROVED.toString():
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case GeneralStatus.REJECTED.toString():
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Paper className={killPaperOutwrap ? " p-0! w-full " : ""}>
            <div className="max-w-7xl  px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">Order Tracker</h1>

                {/* Order List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    {pageData?.content.map((order) => (
                        <div key={order.trade.id} className="p-6 border-b last:border-b-0">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-lg font-semibold">Order #{order.trade.id}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.trade.status)}`}>
                                            {order.trade.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Created: {new Date(order.trade.dateCreated).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <p className="text-lg font-semibold">
                                        ${order.trade.totalPrice.toFixed(2)}
                                    </p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedTrade(order);
                                                setIsDetailModalOpen(true);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            Details
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pageData && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {currentPage * pageData.pageable.pageSize + 1} - {Math.min((currentPage + 1) * pageData.pageable.pageSize, pageData.total)} of {pageData.total} orders
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === Math.ceil(pageData.total / pageData.pageable.pageSize) - 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Order Details Modal */}
                <Dialog
                    open={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    className="relative z-50"
                >
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="mx-auto max-w-2xl w-full rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
                            <DialogTitle className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
                                Order Details #{selectedTrade?.trade.id}
                            </DialogTitle>

                            {selectedTrade && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Customer Information</h3>
                                        <p>Name: {selectedTrade.trade.trader.name}</p>
                                        <p>Contact: {selectedTrade.trade.trader.contact}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Delivery Address</h3>
                                        {(() => {
                                            try {
                                                const addresses = JSON.parse(selectedTrade.trade.trader.locationJson);
                                                return addresses.map((address: any, index: number) => (
                                                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <p className="font-medium">{address.logisticReceiver}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Contact: {address.contact}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{address.fullAddress}</p>
                                                    </div>
                                                ));
                                            } catch (error) {
                                                return <p className="text-gray-500 dark:text-gray-400">No address information available</p>;
                                            }
                                        })()}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2 clear-both">
                                            Items
                                            <span className="float-right">
                                                <Button onClick={() => { fetchOrders() }} >
                                                    refresh
                                                </Button>
                                            </span>
                                        </h3>
                                        <div className="space-y-4">
                                            {stateControl && selectedTrade.transactions.map((transaction) => (
                                                <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{transaction.product.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Quantity: {transaction.amount}
                                                        </p>
                                                    </div>
                                                    <div className="text-right gap-3 grid md:flex">
                                                        <div>
                                                            <p className="font-medium">
                                                                ${(transaction.price * transaction.amount * transaction.discount).toFixed(2)}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Status: {transaction.status}
                                                            </p>
                                                        </div>
                                                        {
                                                            userInfo && !isCredTrader(userInfo) && (
                                                                <Button paddingless
                                                                    onClick={() => {
                                                                        setSelectedOrder(transaction);
                                                                        console.log(transaction, 333)
                                                                        setIsStatusModalOpen(true);
                                                                    }}
                                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                                >
                                                                    Update Status
                                                                </Button>
                                                            )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <p className="text-lg font-semibold">Total</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${selectedTrade.trade.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Status Update Modal */}
                <Dialog
                    open={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    className="relative z-50"
                >
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
                            <DialogTitle className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
                                Update Order Status
                            </DialogTitle>

                            <div className="space-y-4">
                                <select
                                    value={selectedOrder?.status || ''}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {TradeStatus.map((status: string, index: any) => (
                                        <option key={status} value={index}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setIsStatusModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedOrder) {
                                                handleStatusChange(selectedOrder.status);
                                            }
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        </Paper>
    );
}
