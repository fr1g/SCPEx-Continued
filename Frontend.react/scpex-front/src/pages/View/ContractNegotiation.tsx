import { Input } from "@headlessui/react";
import { inputClassNames } from "../../env";
import ContractNegotiationModel from "../../models/ContractNegotiation";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { UserCredential } from "../../models/UserCredential";
import { api } from "../../axios";
import PageRequest from "../../models/PageRequest";
import Pageable from "../../models/Pageable";
import { doInvalidCredentialAction } from "../../tools/AuthTools";
import { useNavigate } from "react-router";
import PageableList from "../../components/PageableList";
import Button from "../../components/Fragments/Button";
import { slices } from "../../tools/ReduceHelper";

export default function ContractNegotiation() {
    function createEmptyContract() {
        return new ContractNegotiationModel(
            null,
            "",
            ""
        )
    }

    const dispatch = useDispatch();

    function alerty(msg: any){
        dispatch(slices.globalModal.actions.showModal({visible: true, title: 'info', message: msg}))
    }

    const { userInfo }: { userInfo: UserCredential } = useSelector(
        (s: any) => s.auth,
    );
    const [currentContract, setCurrentContract] = useState<ContractNegotiationModel>(createEmptyContract());
    const [pageContent, setPageContent] = useState<Pageable | null>(null);
    const navigate = useNavigate();

    // console.log(userInfo)

    async function refresh(page = 0) {
        const pr = new PageRequest();
        try {
            const result = await api.Trade.getListedCoNes(
                page,
                userInfo.token,
                pr,
            );
            console.log(result.content)
            if (result.code === 200 && result.content) {
                const pageData = JSON.parse(result.content) as Pageable;
                setPageContent(pageData);
            }
        } catch (error: any) {
            if (error.message.includes("401")) {
                doInvalidCredentialAction(dispatch, navigate);
            } else console.error("Error loading list:", error);
        }
    }

    useEffect(() => {refresh()}, [])

    const createContract = useCallback(async () => {
        try {
            const result = await api.Trade.createContractNegotiation(
                userInfo.token,
                currentContract,
            );

            if (result.code === 200) {
                alerty("Contract Negotiation Sent!");
                refresh();
                setCurrentContract(createEmptyContract());
            } else {
                alerty(`OP failed: ${result.message || "unknown?"}`);
            }
        } catch (error: any) {
            console.error("OP failed:", error);
            alerty(`OP failed: ${error.message || "unknown"}`);
        }
    }, [currentContract, userInfo.token]);

    return (
        <>
            <h1 className="text-3xl font-semibold">Contract Negotiation</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className={` ${userInfo.userClass.toLowerCase() == 'seller' ? '' : 'hidden'}  `}>
                    <h2 className="text-xl font-semibold mb-4">标题</h2>
                    <div className="space-y-3">
                        <Input
                            className={inputClassNames}
                            placeholder="标题"
                            type="text"
                            value={currentContract.title || ""}
                            onChange={e =>
                                setCurrentContract(prev => ({ ...prev, title: e.target.value }))
                            }
                        />
                        <Input
                            className={inputClassNames}
                            placeholder="描述"
                            type="text"
                            value={currentContract.description || ""}
                            onChange={e =>
                                setCurrentContract(prev => ({ ...prev, description: e.target.value }))
                            }
                        />
                    </div>

                    <div className={`flex gap-2 mt-4   `}>
                        <button
                            onClick={() => createContract()}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            提交
                        </button>
                        <button
                            onClick={() => setCurrentContract(createEmptyContract())}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            清空表单
                        </button>
                    </div>
                </div>

                <div className={`${userInfo.userClass.toLowerCase() == 'seller' ? '' : 'col-span-full'}  bg-white/20 rounded-lg shadow p-2`}>
                    <h2 className="text-xl font-semibold mb-4 clear-both">
                        List
                        <Button paddingless
                            onClick={() => refresh()}
                            className="mb-2 bg-blue-500 text-white hover:bg-blue-600 float-right text-base! font-medium!"
                        >
                            refresh
                        </Button>
                    </h2>
                    <div className="min-h-[63px] my-3">

                        <PageableList page={pageContent} />

                    </div>
                </div>
            </div>

            <div className="mt-6">
                <details>
                    <summary className="cursor-pointer text-sm text-gray-600">
                        debug
                    </summary>
                    <pre className="text-xs bg-gray-100/30 p-2 rounded mt-2">
                        {JSON.stringify(currentContract, null, 2)}
                    </pre>
                </details>
            </div>
        </>
    );
}
