import axios from 'axios';
import { base } from '../env.ts';
import { bear } from '../tools/AuthTools.ts';
import PageRequest from '../models/PageRequest.ts';
import { Address } from '../models/Address.ts';
import { Product } from '../models/Product.ts';

export default {
    getTrades: async (pageNum: number, page: PageRequest, token: string): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/trades/query/' + pageNum,
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
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
    updateTransaction: async (token: string, target: number | string, newObj: any): Promise<any>  => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/trades/update/' + target,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(newObj)
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

    createContractNegotiation: async (token: string, newObj: any): Promise<any>  => {
        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/create',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(newObj)
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

    getListedCoNes: async (pageNum: number, token: string, page: PageRequest): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/list/' + pageNum,
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
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

    apprCoNe: async (target: number, token: string): Promise<any>  => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/approve/' + target,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
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
    cancelCoNe: async (id: number, token: string): Promise<any>  => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/cancel/' + id,
            headers: {
                'Authorization': bear(token)
            },
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

    createTrade: async (token: string, address: Address): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/create',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(address)
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

    updateTraderAddresss: async (addresses: Address[], token: string): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/addr',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(addresses)
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

    addToCart: async (token: string, productId: number, productAmount: number): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/cart/add',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: `${productId},${productAmount}`
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


    updateEntireCart: async (token: string, cart: Product[]): Promise<any>  => {
        
        let prep = {
            prefers: cart
        }

        let data, config = {
           method: 'post',
           url: base + '/api/trade/cart/update',
           headers: { 
              'Authorization': bear(token), 
              'Content-Type': 'application/json'
           },
           data : JSON.stringify(prep)
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