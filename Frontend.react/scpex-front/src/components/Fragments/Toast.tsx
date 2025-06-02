import React from "react";
import { useImperativeHandle, useRef } from "react";

const PopUpToastContainerClass = "toast-initial fixed p-3 #COLOR# border opacity-95 shadow-xl hover:shadow-2xl rounded-lg mx-auto max-w-max left-0 right-0 inline-block";
const PopUpToastInnerClass = "inline-block use-icon px-2.5 mx-auto font-semibold text-lg";

const Toast = React.forwardRef(
    (props: any, ref: any) => {
        let state = {
            message: null,
            color: 'bg-white',
            toastArea: useRef<HTMLDivElement | null>(null)
        };

        useImperativeHandle(ref, () => (
            {
                PushToast(str = state.message, ucolor = state.color, later = 0, disappear = 3200) {
                    if(str == null) return;
                    let color = ucolor;
                    setTimeout(() => {
                        switch (color) {
                            case "normal":
                                // do nothing on the color
                                break;
                            case "warn":
                                color = "bg-yellow-400";
                                break;
                            case "err":
                                color = "bg-[#fecaca]";
                                break;
                            case 'blur':
                                color = 'backdrop-blur-md'
                            default:
                                break;
                        }
                        let containerC = PopUpToastContainerClass.replace('#COLOR#', color);
                        let nPopToast = document.createElement('div');
                        let nPopToastText = document.createElement('p');
                        nPopToastText.innerHTML = str;
                        nPopToast.appendChild(nPopToastText);
                        for (let ii of containerC.split(" ")) {
                            nPopToast.classList.add(ii);
                        }
                        for (let ii of PopUpToastInnerClass.split(" ")) {
                            nPopToastText.classList.add(ii);
                        }
                        state.toastArea.current!.appendChild(nPopToast);

                        setTimeout(() => {
                            nPopToast.classList.replace('toast-initial', 'toast-leave')
                        }, disappear);
                        setTimeout(() => {
                            state.toastArea.current!.removeChild(nPopToast);
                        }, 787 + disappear);

                    }, later);
                },
            }
        ));

        return <div ref={state.toastArea} className="popup-container fixed taz select-none bottom-0" id="popup-container" >
            <div className="PopUpToastArea transition fixed  taz m-2 text-left right-0 left-0 bottom-0 pb-3 " id="pa">
            </div>
        </div>
    }
)

export default Toast;
