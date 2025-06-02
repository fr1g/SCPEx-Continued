import axios from 'axios';
import { base } from '../env.ts';
import PageRequest from '../models/PageRequest.ts';
import { bear } from '../tools/AuthTools.ts';
import { Operation } from '../models/Operation.ts';

export default {
    getTrader: async (token: string, id: number | string): Promise<any>  => { // very example

        let data, config = {
            method: 'post',
            url: base + '/api/users/t/' + id,
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

    getListedTraders: async (token: string, page: PageRequest, pageNumber: number): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/users/t/find/' + pageNumber,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(page)
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
    traderOperate: async (token: string, operation: Operation): Promise<any>  => {
        
        let data, config = {
            method: 'post',
            url: base + '/api/users/t/op',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(operation)
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