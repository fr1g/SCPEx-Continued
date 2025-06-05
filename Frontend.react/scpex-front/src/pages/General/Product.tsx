import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Product } from "../../models/Product";
import { api } from "../../axios";
import { GeneralStatus } from "../../models/GeneralEnum";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { userInfo } from "os";
import { UserCredential } from "../../models/UserCredential";
import { useDispatch, useSelector } from "react-redux";
import Paper from "../../components/Fragments/Paper";
import { slices } from "../../tools/ReduceHelper";

const mockProduct: Product = {
    "id": 1,
    "name": "1111",
    "barcode": "kasfhiuwheoprhoahdof90ef",
    "size": "33x33 cm",
    "feature": "none!",
    "warehouse": "Los Angeles",
    "amount": 1,
    "singlePrice": 1,
    "discount": 1,
    "weight": "1kg",
    "status": GeneralStatus.APPROVED,
    "category": {
        "id": 1,
        "name": "Unsorted Category",
        "note": "The default category by system",
        "zone": "Los Angeles",
        "status": 1
    },
    "note": `
    这是一款全新的智能手机，拥有时尚的外观设计和强大的性能。它配备了6.7英寸高清全面屏，带来沉浸式的视觉体验。搭载最新的八核处理器，无论是日常使用还是大型游戏都能流畅运行。

    **主要特点：**
    - 5000mAh大容量电池，持久续航
    - 1亿像素高清三摄，轻松拍出大片
    - 支持5G高速网络，下载上传更快
    - 256GB超大存储空间，照片、视频随心存
    - 屏下指纹识别，安全便捷

    这款手机不仅性能强劲，还支持多种智能功能，如AI语音助手、人脸识别解锁等，是您工作和娱乐的理想选择。
    `
}

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchProduct = async () => {
            const response = await api.Stock.getProdInfo(id as unknown as number);
            let data = JSON.parse(response.content) as Product;
            setProduct(data);
        }
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            if(userInfo == undefined)
                dispatch(slices.globalModal.actions.showModal({visible: true, message: 'Please Log In, if you\'re our member.'}));
            const response = await api.Trade.addToCart(userInfo.token, id as unknown as number, quantity);
            setIsSuccessDialogOpen(true);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const renderProductInfo = (product: Product) => (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="text-2xl font-semibold text-blue-600">
                ${product.singlePrice.toFixed(2)}
                {product.discount < 1 && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                        ${(product.singlePrice / product.discount).toFixed(2)}
                    </span>
                )}
            </div>
            <div className="space-y-2">
                <p><span className="font-semibold">Barcode:</span> {product.barcode}</p>
                <p><span className="font-semibold">Size:</span> {product.size}</p>
                <p><span className="font-semibold">Weight:</span> {product.weight}</p>
                <p><span className="font-semibold">Feature:</span> {product.feature}</p>
                <p><span className="font-semibold">Warehouse:</span> {product.warehouse}</p>
                <p><span className="font-semibold">Category:</span> {product.category.name}</p>
                <p><span className="font-semibold">Stock:</span> {product.amount}</p>
            </div>
            <div className="flex items-center space-x-4">
                <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {[...Array(Math.min(10, product.amount))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );

    return (
        <Paper>
            {/* Success Dialog */}
            <Dialog
                open={isSuccessDialogOpen}
                onClose={() => setIsSuccessDialogOpen(false)}
                className="relative z-50"
            >
                {/* Background overlay */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Full-screen container to center the panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
                        <DialogTitle className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
                            Added to Cart Successfully!
                        </DialogTitle>
                        
                        <div className="mt-4 flex flex-col space-y-3">
                            <button
                                onClick={() => setIsSuccessDialogOpen(false)}
                                className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Continue Shopping
                            </button>
                            
                            <button
                                onClick={() => {
                                    setIsSuccessDialogOpen(false);
                                    navigate('/carts');
                                }}
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Go to Cart
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {product ? (
                    <>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Fixed Width */}
                        <div className="md:w-[400px] flex-shrink-0">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src="https://via.placeholder.com/500"
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                
                            </div>
                        </div>

                        {/* Right Column - Flexible Width */}
                        <div className="flex-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                {renderProductInfo(product)}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 prose dark:prose-invert max-w-none bg-white p-4 rounded overflow-auto">
                        <ReactMarkdown>{product.note}</ReactMarkdown>
                    </div>
                </>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
        </Paper>
    );
}