import axios from 'axios';
import { base } from '../env.ts';
import PageRequest from '../models/PageRequest.ts';
import { bear } from '../tools/AuthTools.ts';
import { Operation } from '../models/Operation.ts';

export default {
    getEmployee: (token: string, id: number | string) => { // very example

        let data, config = {
            method: 'post',
            url: base + '/api/users/e/' + id,
            headers: {
                'Authorization': `Bearer ${token}`
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

    getListedEmployees: (token: string, page: PageRequest, pageNumber: number) => {

        let data, config = {
            method: 'post',
            url: base + '/api/users/e/find/' + pageNumber,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(page)
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
    EmployeeOperate: (token: string, operation: Operation) => {
        
        let data, config = {
            method: 'post',
            url: base + '/api/users/e/op',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(operation)
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