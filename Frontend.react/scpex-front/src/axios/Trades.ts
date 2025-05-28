import axios from 'axios';
import { base } from '../env.ts';
import { bear } from '../tools/AuthTools.ts';
import PageRequest from '../models/PageRequest.ts';
import { Address } from '../models/Address.ts';
import { Product } from '../models/Product.ts';

export default {
    getTrades: (pageNum: number, page: PageRequest, token: string) => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/trades/query/' + pageNum,
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
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
    updateTransaction: (token: string, target: number | string, newObj: any) => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/trades/update/' + target,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(newObj)
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

    createContractNegotiation: (token: string, newObj: any) => {
        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/create',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(newObj)
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

    getListedCoNes: (pageNum: number, token: string, page: PageRequest) => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/list/' + pageNum,
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
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

    updateCoNe: (newObj: any, token: string) => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/update',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': bear(token)
            },
            data: JSON.stringify(newObj)
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
    cancelCoNe: (id: number, token: string) => {


        let data, config = {
            method: 'post',
            url: base + '/api/trade/cn/cancel/' + id,
            headers: {
                'Authorization': bear(token)
            },
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

    createTrade: (token: string, address: Address) => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/create',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(address)
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

    updateTraderAddresss: (addresses: Address[], token: string) => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/addr',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(addresses)
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

    addToCart: (token: string, productId: number, productAmount: number) => {

        let data, config = {
            method: 'post',
            url: base + '/api/trade/cart/add',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: `${productId},${productAmount}`
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


    updateEntireCart: (token: string, cart: Product[]) => {
        
        let data, config = {
           method: 'post',
           url: base + '/api/trade/cart/update',
           headers: { 
              'Authorization': bear(token), 
              'Content-Type': 'application/json'
           },
           data : JSON.stringify(cart)
        };
        
        axios(config)
        .then(function (response) {
           console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
           console.log(error);
        });

    }


}