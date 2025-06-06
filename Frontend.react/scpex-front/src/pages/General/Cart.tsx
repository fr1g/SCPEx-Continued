import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCredential } from "../../models/UserCredential";
import { api } from "../../axios";
import PageRequest from "../../models/PageRequest";
import { Product } from "../../models/Product";
import { Radio, RadioGroup, RadioGroupOption } from "@headlessui/react";
import { Link } from "react-router";
import Toast from "../../components/Fragments/Toast";
import { slices } from "../../tools/ReduceHelper";

interface CartItem extends Product {
    amount: number;
    discount: number;
}

interface Address {
    logisticReceiver: string;
    contact: string;
    fullAddress: string;
}

export default function CartPage() {
    const { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const toastRef = useRef<any>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {   
            const response = await api.Auth.getMe(userInfo.token);
            let data = JSON.parse(response.content);
            const locationJson = JSON.parse(data.locationJson || "[]") as Address[];
            if (response && Array.isArray(locationJson)) {
                setAddresses(locationJson);
                if (locationJson.length > 0) {
                    setSelectedAddress(locationJson[0]);
                }
            }
            const preferJson = JSON.parse(data.preferJson).prefers as CartItem[];
            setCartItems(preferJson);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        try {
            const updatedItem = cartItems.find(item => item.id === itemId);
            if (updatedItem) {
                updatedItem.amount = newQuantity;
                await api.Trade.updateEntireCart(userInfo.token, cartItems as Product[]);
                setCartItems(items => 
                    items.map(item => 
                        item.id === itemId ? { ...item, amount: newQuantity } : item
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            const updatedCart = cartItems.filter(item => item.id !== itemId);
            await api.Trade.updateEntireCart(userInfo.token, updatedCart as Product[]);
            setCartItems(updatedCart);
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            dispatch(slices.globalModal.actions.showModal({visible: true, message: 'Please select a delivery address'}))
            return;
        }
        try {
            await api.Trade.createTrade(userInfo.token, selectedAddress);
            setCartItems([]);
            // 显示成功提示
            if (toastRef.current) {
                toastRef.current.PushToast("Order submitted successfully!", "bg-green-500");
            }
        } catch (error) {
            console.error('Failed to submit order:', error);
            // 显示错误提示
            if (toastRef.current) {
                toastRef.current.PushToast("Failed to submit order. Please try again.", "bg-red-500");
            }
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const itemTotal = item.singlePrice * item.amount * item.discount;
            return total + itemTotal;
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen text-black dark:text-white bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:py-15 text-black dark:text-white bg-gray-50 dark:bg-gray-900 py-8 px-3 md:px-5 lg:px-7">
            <Toast ref={toastRef} />
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
                
                {cartItems?.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            {cartItems.map((item) => (
                                <div key={item.id} className="p-6 border-b last:border-b-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Category: {item.category.name}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.amount - 1))}
                                                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center">{item.amount}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.amount + 1)}
                                                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${(item.singlePrice * item.amount * item.discount).toFixed(2)}
                                                </p>
                                                {item.discount < 1 && (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        ${(item.singlePrice * item.amount).toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                            {addresses?.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">No delivery addresses found</p>
                                    <Link
                                        to="/view/address-book"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Add Delivery Address
                                    </Link>
                                </div>
                            ) : (
                                <RadioGroup className={'transition-all'} value={selectedAddress} onChange={setSelectedAddress}>
                                    <div className="space-y-4 transition-all">
                                        {addresses.map((address, index) => (
                                            <Radio
                                                key={index}
                                                value={address}
                                                className={({ checked }) =>
                                                    `relative transition-all flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none ${
                                                        checked
                                                            ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-500'
                                                            : 'bg-white dark:bg-gray-700'
                                                    }`
                                                }
                                            >
                                                {({ checked }) => (
                                                    <div className="flex w-full items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="text-sm">
                                                                <RadioGroup.Label
                                                                    as="p"
                                                                    className={`font-medium ${
                                                                        checked
                                                                            ? 'text-blue-900 dark:text-blue-100'
                                                                            : 'text-gray-900 dark:text-gray-100'
                                                                    }`}
                                                                >
                                                                    {address.logisticReceiver}
                                                                </RadioGroup.Label>
                                                                <RadioGroup.Description
                                                                    as="span"
                                                                    className={`inline ${
                                                                        checked
                                                                            ? 'text-blue-700 dark:text-blue-300'
                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                    }`}
                                                                >
                                                                    <span className="block">{address.contact}</span>
                                                                    <span className="block">{address.fullAddress}</span>
                                                                </RadioGroup.Description>
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-blue-600">
                                                            {checked && (
                                                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                                                                    <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.2" />
                                                                    <path
                                                                        d="M7 13l3 3 7-7"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Radio>
                                        ))}
                                    </div>
                                </RadioGroup>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Order Summary</h2>
                                <p className="text-2xl font-bold text-blue-600">
                                    ${calculateTotal().toFixed(2)}
                                </p>
                            </div>
                            
                            <button
                                onClick={handleCheckout}
                                disabled={!selectedAddress}
                                className={`w-full transition shadow-md hover:shadow-lg py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    selectedAddress
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300/30 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {selectedAddress ? 'Submit Order' : 'Select a Delivery Address'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}