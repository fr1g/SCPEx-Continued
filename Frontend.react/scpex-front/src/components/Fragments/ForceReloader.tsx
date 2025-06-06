import React from "react";

export class ForceReloader extends React.Component {

    handleClick = () => {
        // force a re-render
        this.forceUpdate();
    };

    render() {
        console.log('App component: render()')
        return (
            <>
                <div className="text-sm opacity-10">rerender forcement</div>
            </>
        );
    }
}