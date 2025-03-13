import { Component, ReactNode } from "react";




export default class ListItem extends Component{



    render(): ReactNode {
        return (
            <div className={`rounded-lg bg-slate-300 dark:bg-slate-700 grid?grid-cols-7 gap-1`}>
                <div className={`w-32 h-32 z-[3]`} style={{background: `url(${this.props.cover! as string})`}}>
                    <div className="z-[1]">eee</div>
                </div>
            </div>
        ) as ReactNode;
    }
}