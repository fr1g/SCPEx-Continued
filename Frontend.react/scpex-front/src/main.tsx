// import { StrictMode } from 'react'
import App from './App.tsx'

// import React from "react";
import {Context, createContext} from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from './components/Header.tsx';
import SearchGoods from './pages/General/SearchGoods.tsx';
import AuthLayout from './pages/Auth/AuthLayout.tsx';
import { UserCredential } from './models/UserCredential.ts';
import {getUserCredential} from './tools/AuthTools.ts'

const UserContext: Context<UserCredential | null>= createContext(getUserCredential());

ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
        <BrowserRouter>
            <Header credential={null} />
            <Routes>
                <Route index element={<App />} />
                <Route path='/search' element={<SearchGoods />} />
                <Route path='/auth' element={<AuthLayout />} />
            </Routes>
        </BrowserRouter>
    </>
);

