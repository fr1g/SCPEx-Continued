import { StrictMode } from 'react'
import App from './App.tsx'

// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from './components/Header.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Header credential={null} />
        <BrowserRouter>
            <Routes>
                <Route index element={<App />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);

