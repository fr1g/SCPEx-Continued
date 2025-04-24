import {createBrowserRouter, Route, RouterProvider, Routes, useLocation} from 'react-router';
import Paper from '../../components/Fragments/Paper';
import AuthBase from './Base';
import Login from './Login';
import Register from './Register';
import { useEffect, useState } from 'react';
import useLeaveAnimate from '../../tools/LeaveAnimate';
import { AnimatePresence } from 'framer-motion';
import AnimationLayer from '../../components/Fragments/AnimationLayer';

export default function AuthLayout(){

    let location = useLocation();
    let [variate, setVariate] = useState('');

    useEffect(() => {
        switch(location.pathname){
            case "/auth/register":
                setVariate(": Register");
                break;
            case "/auth/login":
                setVariate(": Login");
                break;
            case "/auth/register/done":
                setVariate(": Complete!");
                break;
            default:
                setVariate("");
                break;
        }
    }, [location.pathname]);

    return <>
        <Paper className="grid grid-cols-1 items-center justify-center justify-items-center">
            <div className='bg-slate-100 dark:bg-slate-600 w-full sm:max-w-[85%] md:max-w-[60%] shadow-lg rounded-lg transition text-slate-950 dark:text-slate-50 p-6 hover:shadow-xl'>
                <p className='text-3xl text-slate-950 dark:text-slate-50 mb-2.5 font-semibold'>Authentication{variate}</p>
                {/* <RouterProvider router={routes} /> */}
                <AnimatePresence mode='wait'>
                    <Routes>
                        <Route path="/register/*" element={<AnimationLayer><Register /></AnimationLayer>} />
                        <Route path="/login" element={<AnimationLayer><Login /></AnimationLayer>} />
                        <Route path="/" element={<AnimationLayer><AuthBase /></AnimationLayer>} />
                    </Routes>
                </AnimatePresence>
            </div>
        </Paper>
    </>
}