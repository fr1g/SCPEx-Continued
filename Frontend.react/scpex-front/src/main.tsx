// import { StrictMode } from 'react'
import App from './App.tsx'

// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from './components/Header.tsx';
import SearchGoods from './pages/General/SearchGoods.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
        <BrowserRouter>
            <Header credential={null} />
            <Routes>
                <Route index element={<App />} />
                <Route path='/search' element={<SearchGoods />} />
            </Routes>
        </BrowserRouter>
    </>
);

