import fetch from "node-fetch"

import {WHMCS_API_ENDPOINT} from '../index.js'
import {WHMCS_USERNAME} from '../index.js'
import {WHMCS_PASSWORD} from '../index.js'

export default class WHMCSRequest {

    constructor() {
        this.params = new URLSearchParams()
    }

    request(method = 'GET', body, options = {}) {
        return new Promise((resolve) => {
            const params = this.#getApiParameters(body);
            const request = this.#createRequest(method, params)
            fetch(WHMCS_API_ENDPOINT, request)
                .then((res) => this.#handleException(res, resolve));
        });
    }

    #handleException(res, resolve) {
        res.text().then((data) => {
            this.#throwError(resolve, data);
        });
    }

    #throwError(resolve, data) {
        try {
            resolve(JSON.parse(data));
        } catch (e) {
            throw new Error(`Invalid response: ${data}`);
        }
    }

    #createRequest(method, params) {
        return {
            method, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: params.toString()
        };
    }

    #getApiParameters(body) {
        const params = new URLSearchParams();
        params.append('identifier', WHMCS_USERNAME);
        params.append('secret', WHMCS_PASSWORD);
        Object.keys(body).forEach((key) => params.append(key, body[key]));
        return params;
    }
}