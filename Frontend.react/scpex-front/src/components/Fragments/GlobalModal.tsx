import { useState } from "react"
import Button from "./Button"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useDispatch, useSelector } from "react-redux";
import { slices as s } from "../../tools/ReduceHelper";

export default function GlobalModal({ }) {
    let hideModal = s.globalModal.actions.hideModal,
        selectGlobalModal = (st: any) => { return st.globalModal};
    const dispatch = useDispatch();
    const { visible, title, message } = useSelector(selectGlobalModal);

    // let [isOpen, setIsOpen] = useState(visible);

    // function open() {
    //     setIsOpen(true);
    // }

    function close() {
        // setIsOpen(false);
        dispatch(hideModal());
    }

    return (
        <>
            <Dialog open={visible} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                {title}
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 dark:text-white text-black">
                                {message}
                            </p>
                            <div className="mt-4">
                                <Button fix paddingless
                                    className="inline-flex transition! items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                    onClick={close}
                                >
                                    OK
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

        </>)
}