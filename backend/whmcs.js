import fetch from "node-fetch"

import {WHMCS_API_ENDPOINT} from '../index.js'

export default class WHMCSRequest {

    constructor(options) {
        this.options = options
    }

    createRequest() {
        fetch(WHMCS_API_ENDPOINT, this.options)
            .then(res => this.parseJson(res.json()))
    }

    parseJson(data) {
        console.log(data)
    }
}