import axios from 'axios';
import { base } from '../env.ts';
import { bear } from '../tools/AuthTools.ts';
import { LoginDataTransfer } from '../models/LoginDataTransfer.ts';

export default {
    getMe: (token: string) => {

        let data, config = {
            method: 'post',
            url: base + '/api/auth/getme',
            headers: {
                'Authorization': bear(token)
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                data = response.data;
            })
            .catch(function (error) {
                console.log(error);
                throw error;
            });

        return data;

    },
    generatePasswd: () => {

        let data, config = {
            method: 'get',
            url: base + '/api/auth/passwd',
            headers: {}
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                data = response.data;
            })
            .catch(function (error) {
                console.log(error);
                throw error;
            });

        return data;

    },
    login: (loginRequest: LoginDataTransfer) => {

        let data, config = {
            method: 'post',
            url: base + '/api/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(loginRequest)
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                data = response.data;
            })
            .catch(function (error) {
                console.log(error);
                throw error;
            });

        return data;
    },
    logout: (token: string) => {

        let data, config = {
            method: 'post',
            url: base + '/api/auth/logoff',
            headers: {
                'Authorization': bear(token)
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                data = response.data;
            })
            .catch(function (error) {
                console.log(error);
                throw error;
            });

        return data;

    }


}