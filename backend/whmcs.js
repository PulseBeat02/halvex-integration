import fetch from "node-fetch"

import {WHMCS_API_ENDPOINT, WHMCS_IDENTIFIER, WHMCS_SECRET} from '../index.js'

export default class WHMCSRequest {

    request(params) {
        const request = this.#createRequest()
        const url = WHMCS_API_ENDPOINT + "?" + this.#parseQueries(params)
        return fetch(url, request)
            .then((response) => response.json())
            .then((json) => {
                return json
            });
    }

    #parseQueries(headers) {

        const params = new URLSearchParams()
        params.append('identifier', WHMCS_IDENTIFIER)
        params.append('secret', WHMCS_SECRET)
        params.append('responsetype', 'json')

        Object.keys(headers).forEach((key) => {
            params.append(key, headers[key])
        })

        return params
    }

    #createRequest() {
        return {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
}