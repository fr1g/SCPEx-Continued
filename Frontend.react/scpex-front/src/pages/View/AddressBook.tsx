import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { api } from '../../axios';
import { useSelector } from 'react-redux';
import { UserCredential } from '../../models/UserCredential';
import TitledInput from '../../components/Fragments/TitledInput';
import { inputClassNames } from '../../env';

interface Address {
    logisticReceiver: string;
    contact: string;
    fullAddress: string;
}

export default function AddressBook() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [addressToDeleteIndex, setAddressToDeleteIndex] = useState<number | null>(null);
    const [newAddress, setNewAddress] = useState({
        logisticReceiver: '',
        contact: '',
        fullAddress: '',
    });
    const { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);


    const getAddresses = async () => {
        const response = await api.Auth.getMe(userInfo.token);
        let data = JSON.parse(response.content);
        const locationJson = JSON.parse(data.locationJson || "[]") as Address[];
        if (response && Array.isArray(locationJson)) {
            setAddresses(locationJson);
        }
    }

    useEffect(() => {
        if (userInfo.token) {
            getAddresses();
        }
    }, [userInfo.token]);


    const handleAddAddress = async () => {
        if (newAddress.logisticReceiver && newAddress.contact && newAddress.fullAddress) {
            const updatedAddresses = [
                ...addresses,
                {
                    ...newAddress,
                },
            ];
            try {
                const response = await api.Trade.updateTraderAddresss(updatedAddresses, userInfo.token);
                let data = JSON.parse(response.content);
                const locationJson = JSON.parse(data.locationJson || "[]") as Address[];
                if (response && Array.isArray(locationJson)) {
                    setAddresses(locationJson);
                    setNewAddress({
                        logisticReceiver: '',
                        contact: '',
                        fullAddress: '',
                    });
                    setIsAddModalOpen(false);
                }
            } catch (error) {
                console.error('Failed to add address:', error);
            }
        }
    };

    const handleDeleteAddress = (index: number) => {
        setAddressToDeleteIndex(index);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (addressToDeleteIndex !== null) {
            const updatedAddresses = addresses.filter((_, index) => index !== addressToDeleteIndex);
            try {
                const response = await api.Trade.updateTraderAddresss(updatedAddresses, userInfo.token);
                let data = JSON.parse(response.content);
                const locationJson = JSON.parse(data.locationJson || "[]") as Address[];
                if (response && Array.isArray(locationJson)) {
                    setAddresses(locationJson);
                    setIsDeleteModalOpen(false);
                    setAddressToDeleteIndex(null);
                }
            } catch (error) {
                console.error('Failed to delete address:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Address Book</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Address
                </button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
                {addresses.map((addr, index) => (
                    <div
                        key={index}
                        className="border p-4 rounded-lg flex justify-between items-center bg-slate-500/20"
                    >
                        <div>
                            <h3 className="font-bold text-xl">{addr.logisticReceiver}</h3>
                            <p className="text-gray-600/80 dark:text-gray-100/70 font-semibold text-lg">Contact: {addr.contact}</p>
                            <p className="text-gray-600/70 dark:text-gray-100/50 italic">Address: {addr.fullAddress}</p>
                        </div>
                        <button
                            onClick={() => handleDeleteAddress(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {addresses.length === 0 && (
                    <p className="text-gray-500 text-center">No addresses added yet</p>
                )}
            </div>

            {/* Add Address Modal */}
            <Dialog
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                transition
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white dark:bg-slate-700 text-black dark:text-white rounded-lg p-6 w-full max-w-md">
                        <DialogTitle className="text-lg font-medium mb-4">
                            Add New Address
                        </DialogTitle>
                        <div className="space-y-4">
                            <div>
                                <TitledInput
                                    type="text"
                                    title='Recv Name'
                                    value={newAddress.logisticReceiver}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, logisticReceiver: e.target.value })
                                    }
                                    className={inputClassNames}
                                />
                            </div>
                            <div>
                                <TitledInput
                                    type="text"
                                    title='Contact'
                                    value={newAddress.contact}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, contact: e.target.value })
                                    }
                                    className={inputClassNames}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium ">
                                    Full Address
                                </label>
                                <textarea
                                    value={newAddress.fullAddress}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, fullAddress: e.target.value })
                                    }
                                    className={inputClassNames}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-red-800 hover:text-red-900 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAddress}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
                        <Dialog.Title className="text-lg font-medium mb-4">
                            Confirm Delete
                        </Dialog.Title>
                        <p className="text-gray-600">
                            Are you sure you want to delete this address? This action cannot be
                            undone.
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}