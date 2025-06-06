import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../axios';
import { Category } from '../../models/Category';
import { UserCredential } from '../../models/UserCredential';
import { GeneralStatus } from '../../models/GeneralEnum';
import TitledInput from '../Fragments/TitledInput';
import Button from '../Fragments/Button';


export default function EAUCategory() {
    const { userInfo }: { userInfo: UserCredential } = useSelector((s: any) => s.auth);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState<Partial<Category>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await api.Stock.listCat();
                setCategories(JSON.parse(response.content));
            } catch (err) {
                setError('Failed to load List');
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    // 創建新分類
    const handleCreate = async () => {
        if (!userInfo?.token) return;

        try {
            const response = await api.Stock.newCat(
                userInfo.token,
                new Category(
                    null,
                    newCategory.name || '',
                    newCategory.zone || '',
                    newCategory.note || '',
                    GeneralStatus.APPROVED
                )
            );
            setCategories([...categories, JSON.parse(response.content)]);
            setNewCategory({});
        } catch (err) {
            setError('failed to create');
        }
    };

    const toggleStatus = async (id: number) => {
        if (!userInfo?.token) return;

        try {
            await api.Stock.giveUpCat(userInfo.token, id);
            setCategories(categories.map(cat =>
                cat.id === id ? {
                    ...cat,
                    status: cat.status === GeneralStatus.APPROVED
                        ? GeneralStatus.REJECTED
                        : GeneralStatus.APPROVED
                } : cat
            ));
        } catch (err) {
            setError('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-300/20 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Creating Cat</h2>
                <div className="grid gap-3">
                    <TitledInput
                        type="text"
                        placeholder="Name"
                        className="p-2 border rounded"
                        value={newCategory.name || ''}
                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                    <TitledInput
                        type="text"
                        placeholder="Region"
                        className="p-2 border rounded"
                        value={newCategory.zone || ''}
                        onChange={e => setNewCategory({ ...newCategory, zone: e.target.value })}
                    />
                    <TitledInput
                        type="text"
                        placeholder="Note"
                        className="p-2 border rounded col-span-2"
                        value={newCategory.note || ''}
                        onChange={e => setNewCategory({ ...newCategory, note: e.target.value })}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create
                </button>
            </div>

            <div className="space-y-2 min-h-[30vh] max-h-[60vh] overflow-x-clip overflow-y-scroll narrow">
                {categories.map(category => (
                    category.id == 1 ? (<p className='opacity-60 mb-1'>the root category was hidden</p>) :
                    <div key={category.id} className="gap-2 grid-cols-1 p-3 border rounded-lg grid justify-between items-center w-full">
                        <div>
                            <h3 className="font-bold">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.zone}</p>
                            <div>
                                <details>
                                    <summary>full info</summary>
                                    <p className="text-sm text-gray-500 mt-1">{category.note}</p>
                                </details>
                            </div>
                        </div>
                        <span className={` w-full px-2 py-1 rounded block 
                        ${(isNaN(parseInt(GeneralStatus[category.status])) ? GeneralStatus[category.status] : category.status ) == GeneralStatus[GeneralStatus.APPROVED]
                            ? 'bg-green-100/50 text-green-800'
                            : 'bg-red-100/50 text-red-800'
                            }`}>
                            {(isNaN(parseInt(GeneralStatus[category.status])) ? GeneralStatus[category.status] : category.status )}
                        </span>
                        <Button paddingless
                            onClick={() => toggleStatus(category.id!)}
                            className="px-4 w-full  py-2 bg-gray-100/30 rounded hover:bg-gray-200/60 block"
                        >
                            Change Dis/Appr
                        </Button>

                    </div>
                ))}
            </div>
        </div>
    );
}