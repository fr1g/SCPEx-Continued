// import { StrictMode } from 'react'
import App from './App.tsx';
import 'url-polyfill';

// import React from "react";
import { Context, createContext, useEffect, useRef } from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router";
import Header from './components/Header.tsx';
import SearchGoods from './pages/General/SearchGoods.tsx';
import AuthLayout from './pages/Auth/AuthLayout.tsx';
import { UserCredential } from './models/UserCredential.ts';
import { getUserCredential } from './tools/AuthTools.ts'
import NoSuchPage from './pages/NoSuchPage.tsx';
import About from './pages/About.tsx';
import { Outlet } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import User from './pages/Param/User.tsx';
import ViewLayout from './pages/View/ViewLayout.tsx';
import { Provider } from 'react-redux';
import store from './tools/Redux.ts';
import GlobalModal from './components/Fragments/GlobalModal.tsx';
import Toast from './components/Fragments/Toast.tsx';
import Button from './components/Fragments/Button.tsx';
import Pheebo from './pages/General/Pheebo.tsx';


const UserContext: Context<UserCredential | null> = createContext(getUserCredential());

const routes = createBrowserRouter([
    {
        element: <Layout />,
        children: [{ index: true, element: <App /> },

        // defaults
        { path: '/search', element: <SearchGoods /> },
        { path: '/about', element: <About /> },
        { path: '/pheebo', element: <Pheebo /> },
        
        // layouts
        { path: '/auth/*', element: <AuthLayout /> },
        { path: '/view/*', element: <ViewLayout /> },
        
        // paramables
        { path: '/user/:selector?', element: <User /> },

        // fallbacks
        { path: '/*', element: <NoSuchPage /> },]
    }
]);

function Layout() {
    const location = useLocation();
    const toast = useRef<any>(null);

    useEffect(() => {
        // console.log(toast.current, ' statt')
        if(localStorage.jumpMessage && toast.current){
            toast.current.PushToast(localStorage.jumpMessage, "bg-white");
            localStorage.removeItem('jumpMessage');
        }
    });

    // const pushToast = (messsage = "testing", color = "bg-white") => toast.current.PushToast(messsage, color);

    return <>
        <Header credential={null} />
        <AnimatePresence mode="wait" >
            <Outlet key={location.key} /> {/* 关键：传递 location */}
        </AnimatePresence>
        <GlobalModal />
        <Toast ref={toast} />
        {/* <Button onClick={_ => pushToast()}>try toast</Button> */}
    </>;
}

function Entrance() {
    return <AnimatePresence mode='wait'>
        <RouterProvider router={routes} />
    </AnimatePresence>
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <Entrance />
    </Provider>
);