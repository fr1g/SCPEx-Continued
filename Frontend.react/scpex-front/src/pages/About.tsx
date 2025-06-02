import Paper from "../components/Fragments/Paper";

export default function About() {


    return <>
        <Paper className="text-black dark:text-white" >
            <div className="text-center">
                <img src="/favicon.png" alt="logo" className="inline-block scale-50 rounded-full transition hover:scale-[60%] shadow-xl" />
            </div>
            <h1 className="text-3xl font-semibold ">About O'Petova</h1>
            <p className="text-lg">
                This is a massive Wholesale Center's Online Trading site. You can buy or sell products from or to the Center.
            </p>
            <h2 className="text-2xl font-semibold ">About Membership</h2>
            <p className="text-lg">
                First, you should contact with our Registrars. Via the contract, you become our member, then you can register with help of Registrar.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-1">Facts</h2>

            <hr />

            <div className="text-lg  my-1">
                Frontend: React, HeadlessUI, TailwindCSS, TypeScript
                <br />
                Backend: Java, MySQL, Spring, RESTFul
            </div>

            <hr />

            <p className="text-lg mt-1">
                All by CHS. Ч. Хайсу, ПРИк-222, 2025, ИИТЭ
            </p>
        </Paper>

    </>
}