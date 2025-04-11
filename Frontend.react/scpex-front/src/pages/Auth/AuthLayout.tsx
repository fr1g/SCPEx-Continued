import {Route, Routes} from 'react-router';
import Paper from '../../components/Fragments/Paper';
import AuthBase from './Base';

export default function AuthLayout(){


    return <>
        <Paper className="grid items-center justify-center justify-items-center">
            <div className='bg-slate-100 dark:bg-slate-800 shadow-lg rounded-lg transition text-slate-950 dark:slate-50 p-6 hover:shadow-xl'>
                <p className='text-xl '>Authentication</p>
                <Routes>
                    <Route path="/register" />
                    <Route path="/login" />
                    <Route path="/" element={<AuthBase />}/>
                </Routes>
            </div>
        </Paper>
    </>
}