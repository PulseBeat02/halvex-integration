import fetch from "node-fetch"

import {WHMCS_API_ENDPOINT} from '../index.js'

export default class WHMCSRequest {

    constructor(options) {
        this.options = options
    }

    createRequest() {
        const options = this.createOptions()
        fetch(WHMCS_API_ENDPOINT, options)
            .then(res => res.json())
            .then(data => {
                return JSON.parse(data)
            })
            .then(err => console.log(err))
    }

    createOptions() {
        return {
            headers: Array.from(this.options, ([name, value]) => ({name, value}))
        }
    }
}