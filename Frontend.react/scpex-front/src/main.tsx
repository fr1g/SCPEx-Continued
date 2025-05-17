// import { StrictMode } from 'react'
import App from './App.tsx';

// import React from "react";
import { Context, createContext } from 'react';
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

const UserContext: Context<UserCredential | null> = createContext(getUserCredential());

const routes = createBrowserRouter([
    {
        element: <Layout />,
        children: [{ index: true, element: <App /> },

        // defaults
        { path: '/search', element: <SearchGoods /> },
        { path: '/about', element: <About /> },
        
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
    return <>
        <Header credential={null} />
        <AnimatePresence mode="wait" >
            <Outlet key={location.key} /> {/* 关键：传递 location */}
        </AnimatePresence>
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