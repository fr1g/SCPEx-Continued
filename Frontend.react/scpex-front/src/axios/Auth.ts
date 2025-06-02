import axios from 'axios';
import { base } from '../env.ts';
import { bear } from '../tools/AuthTools.ts';
import { LoginDataTransfer } from '../models/LoginDataTransfer.ts';

export default {
    getMe: async (token: string): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/auth/getme',
            headers: {
                'Authorization': bear(token)
            }
        };

        let err: Error | null = null;

        await axios(config)
            .then((response) => {
                data = response.data;
            })
            .catch(error => err = error);

        if(err) throw err;
        else return data;

    },
    generatePasswd: async (): Promise<any>  => {

        let data, config = {
            method: 'get',
            url: base + '/api/auth/passwd',
            headers: {}
        };

        let err: Error | null = null;

        await axios(config)
            .then((response) => {
                data = response.data;
            })
            .catch(error => err = error);

        if(err) throw err;
        else return data;

    },
    login: async (loginRequest: LoginDataTransfer): Promise<any> => {

        let data, config = {
            method: 'post',
            url: base + '/api/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(loginRequest)
        };

        let err: Error | null = null;

        await axios(config)
            .then((response) => {
                data = response.data;
            })
            .catch(error => err = error);

        if(err) throw err;
        else return data;
    },
    logout: async (token: string): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/auth/logoff',
            headers: {
                'Authorization': bear(token)
            }
        };

        let err: Error | null = null;

        await axios(config)
            .then((response) => {
                data = response.data;
            })
            .catch(error => err = error);

        if(err) throw err;
        else return data;

    }


}