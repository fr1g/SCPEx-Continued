import axios from 'axios';
import { base } from '../env.ts';
import { bear } from '../tools/AuthTools.ts';
import PageRequest from '../models/PageRequest.ts';
import { Operation } from '../models/Operation.ts';
import { Category } from '../models/Category.ts';

export default {
    search: async (page: PageRequest, pageNum: number): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/products/search/' + pageNum,
            headers: {
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
    getProdInfo: async (id: number): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/products/info/' + id,
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

    prodOps: async (token: string, op: Operation): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/op',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(op)
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

    newCat: async (token: string, cat: Category): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/new',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(cat)
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

    getCat: async (token: string, catId: number): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/' + catId,
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

    listCat: async (token: string): Promise<any>  => { // this is all list without pagination

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/list/',
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

    giveUpCat: async (token: string, catId: number): Promise<any>  => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/disable/' + catId,
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