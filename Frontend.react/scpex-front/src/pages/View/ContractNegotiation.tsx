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
import { getById, isOneOf } from "../../tools/misc";
import TitledInput from "../../components/Fragments/TitledInput";
import { AxiosError } from "axios";

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
    const [selected, set] = useState<number | null>(null)
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
            // console.log(result.content)
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

    function handleCLick(e: any){
        let _ = (e.target as HTMLElement).id
        // console.log(_);
        try {
            set(parseInt(_));
        } catch (error) {
            set(null);
        }

    }

    async function doUpdate(id: number, act: "swcl" | "appr"){
        let res: any;
        try {
            if(act == 'appr'){

                res = await api.Trade.apprCoNe(id, userInfo.token);
    
            }else{
    
                res = await api.Trade.cancelCoNe(id, userInfo.token);
    
            }
        } catch (error: any) {
            const ex = error as AxiosError;
            let parsed = ex.response && (ex.response?.data as any);
            console.log(parsed.content)
            if(parsed.content && `${parsed.content}`.toLowerCase().includes("could"))
                dispatch(slices.globalModal.actions.showModal({visible: true, message: "Error occured: maybe Reached the update limit."}))
        }

        // console.log(res);
        if(res)
            refresh();
    }

    function renderFormatted(cn: ContractNegotiationModel): React.ReactNode{

        return <div>
            <p><span>Title:</span> {cn.title} ({cn.id})</p>
            <p className="truncate"><span>Desc:</span> {cn.description}</p>
            <p><span>Sender:</span> {cn.sender?.name ?? "unknown"}({cn.sender?.id ?? -1})</p>
            <p><span>Date:</span> {cn.dateCreated}</p>

            <div className="mt-1">
                <p>Operations</p>
                {cn.id ? <div className="flex gap-2">
                    <Button paddingless onClick={() => {doUpdate(cn.id!, "appr")}} >Approve it</Button>
                    <Button paddingless onClick={() => {doUpdate(cn.id!, "swcl")}} >Switch Close</Button>
                </div> : <div>...</div>}
            </div>
        </div>
    }

    return (
        <>
            <h1 className="text-3xl font-semibold">Contract Negotiation</h1>

            {
                isOneOf(userInfo.userClass, ['admin', 'warehouse']) && <div className="grid grid-cols-1 gap-3 mt-1">
                    <p>Management on ID: {selected ?? 'nothing'}</p>
                    <div>
                        {pageContent && selected ? renderFormatted(getById(selected, pageContent!.content) as ContractNegotiationModel) : 'choose one...'}
                    </div>
                </div>
            }

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className={` ${userInfo.userClass.toLowerCase() == 'seller' ? '' : 'hidden'}  `}>
                    <h2 className="text-xl font-semibold mb-4">Start a new CN</h2>
                    <div className="space-y-3">
                        <TitledInput
                            className={inputClassNames}
                            placeholder="Title"
                            type="text"
                            value={currentContract.title || ""}
                            onChange={e =>
                                setCurrentContract(prev => ({ ...prev, title: e.target.value }))
                            }
                        />
                        <TitledInput
                            className={inputClassNames}
                            placeholder="Description"
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
                            Submit
                        </button>
                        <button
                            onClick={() => setCurrentContract(createEmptyContract())}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Clear Form
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

                        <PageableList page={pageContent} contentClickEvent={handleCLick} />

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
