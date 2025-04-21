import Icon from "../components/Fragments/Icon";
import Paper from "../components/Fragments/Paper";




export default function NoSuchPage(){


    return <>
        <Paper className="grid! justify-items-center justify-center items-center">
            <div className="w-full text-center">
                <div className="relative inline-block mb-3">
                    <Icon className="text-6xl inline-block opacity-70" pua="ea5e" />
                    <Icon className="text-5xl block z-[3] absolute right-0 left-5 -translate-y-5 animate-bounce" forceNoTranslate pua="ed2e" />
                </div>
                <br />
                <h1 className="w-full text-center text-3xl font-semibold my-3">Here's... No such page you're looking for...</h1>
                <p className="w-full text-center text-xl my-3">Click the Brand Logo on the NavBar to take you home :P</p>
            </div>
        </Paper>
    </>;
}