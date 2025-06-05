import { Component, ReactNode } from "react";
import Icon from "./Icon";
import { MouseEventHandler } from "react";

interface ListItemProps {
    cover?: string;
    coverAlt?: string;

    title: string;
    id?: string;
    detail?: string;
    extra?: ReactNode;
    price?: string;

    onlyTopEvent?: boolean

    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default class ListItem extends Component<ListItemProps>{

    render(): ReactNode {
        return (
            <div id={this.props.id} onClick={this.props.onClick ?? (() => {console.log("ListItem Received Click. (native)")})} className={`text-slate-950 dark:text-slate-50   rounded-lg h-full bg-slate-300 dark:bg-slate-700 flex flex-row shadow-md hover:shadow-lg overflow-hidden opacity-100 hover:opacity-90 active:opacity-80 transition`}>
                <div className={`w-32 h-32 relative @COVER  ${this.props.onlyTopEvent ? 'pointer-events-none' : 'passing-event'}`}>
                    {/* <img src="" alt="" />  to prevent image stealing so gave up img */}
                    <div className={`w-32 h-32 z-[3] absolute @COVER-PRESCENCE `} style={{background: `url(${this.props.cover! as string})`}}></div>
                    <div className="z-[1] absolute text-black dark:text-white grid justify-center justify-items-center items-center w-32 h-28 overflow-hidden">
                        <div className="w-full text-center">
                            <div className="w-full text-center"> <Icon pua="eb9f" /> </div>
                            <div className="w-full text-center">{this.props.coverAlt ?? 'Cover'}</div>
                        </div>
                    </div>
                </div>
                <div className={`grow @INFO p-1.5 px-2 md:p-3 md:px-5 h-full relative flex flex-col ${this.props.onlyTopEvent ? 'pointer-events-none' : 'passing-event'}`}>
                    <h3 className={`font-semibold @TITLE text-lg md:text-xl`}>
                        {this.props.title ?? "Empty"}
                    </h3>
                    <div className={`@SUBTITLE / INFO / DETAILS h-full grow relative flex ${(this.props.detail == undefined && this.props.price == undefined) ? 'hidden' : ''}   `}>
                        <p className="grow text-sm opacity-80 truncate  ">
                            {this.props.detail ?? ""}
                        </p>
                        <p className={`price absolute bottom-7 bmd:bottom-5 right-1.5 md:-right-1  font-semibold text-2xl pl-1 ${(this.props.price == undefined) ? 'hidden' : ''}`}>
                            {this.props.price}
                        </p>
                    </div>

                    <div className={`@EXTRA()  ${this.props.extra == undefined ? 'hidden' : ''}  absolute bottom-1.5 right-3.5 opacity-60 font-semibold `}>
                        {this.props.extra}
                    </div>
                </div>
            </div>
        ) as ReactNode;
    }
}