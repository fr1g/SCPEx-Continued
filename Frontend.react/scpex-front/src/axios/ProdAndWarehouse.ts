import axios from 'axios';
import { base } from '../env.ts';
import { bear } from '../tools/AuthTools.ts';
import PageRequest from '../models/PageRequest.ts';
import { Operation } from '../models/Operation.ts';
import { Category } from '../models/Category.ts';

export default {
    search: (page: PageRequest, pageNum: number) => {

        let data, config = {
            method: 'post',
            url: base + '/api/products/search/' + pageNum,
            headers: {
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
    getProdInfo: (id: number) => {

        let data, config = {
            method: 'post',
            url: base + '/api/products/info/' + id,
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

    prodOps: (token: string, op: Operation) => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/op',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(op)
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

    newCat: (token: string, cat: Category) => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/new',
            headers: {
                'Authorization': bear(token),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(cat)
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

    getCat: (token: string, catId: number) => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/' + catId,
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

    listCat: (token: string) => { // this is all list without pagination

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/list/',
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

    giveUpCat: (token: string, catId: number) => {

        let data, config = {
            method: 'post',
            url: base + '/api/warehouse/cat/disable/' + catId,
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