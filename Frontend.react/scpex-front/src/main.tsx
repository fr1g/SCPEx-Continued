// import { StrictMode } from 'react'
import App from './App.tsx';

// import React from "react";
import { Context, createContext } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router";
import Header from './components/Header.tsx';
import SearchGoods from './pages/General/SearchGoods.tsx';
import AuthLayout from './pages/Auth/AuthLayout.tsx';
import { UserCredential } from './models/UserCredential.ts';
import { getUserCredential } from './tools/AuthTools.ts'
import NoSuchPage from './pages/NoSuchPage.tsx';
import About from './pages/About.tsx';
import { useBlocker } from 'react-router';

const UserContext: Context<UserCredential | null> = createContext(getUserCredential());

//    useBlocker(({ currentLocation, nextLocation }) => {
//         if(currentLocation.pathname !== nextLocation.pathname)
//             console.log("changed");
//         console.log(currentLocation.pathname, nextLocation.pathname);
//         return true;
//     });

const routes = createBrowserRouter([
    {path: '/', element: <App />},
    {path: '/search', element: <SearchGoods /> },
    {path: '/auth/*', element: <AuthLayout /> },
    {path: '/about', element: <About /> },
    {path: '/*', element: <NoSuchPage />},
]);

function Entrance() {
    // useBlocker(({ currentLocation, nextLocation }) => {
    //     if(currentLocation.pathname !== nextLocation.pathname)
    //         console.log("changed");
    //     console.log(currentLocation.pathname, nextLocation.pathname);
    //     return true;
    // }); 
    return <>
        <Header credential={null} />
        <RouterProvider router={routes}  />
    </> ;

}

{/* <>
<BrowserRouter>
    <Header credential={null} />
    <Routes>
        <Route index element={<App />} />
        <Route path='/search' element={<SearchGoods />} />
        <Route path='/auth/*' element={<AuthLayout />} />
        <Route path='/about' element={<About />} />

        <Route path='/*' element={<NoSuchPage />} />
    </Routes>
</BrowserRouter>
</>; */}

ReactDOM.createRoot(document.getElementById("root")!).render(<Entrance />);

