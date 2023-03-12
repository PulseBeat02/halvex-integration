import WHMCSRequest from './whmcs.js'

export default class RequestBuilder {

    constructor() {
        this.map = new Map()
    }

    addRequestParameter(key, value) {
        this.map.set(key, value)
        return this
    }

    build() {
        return new WHMCSRequest(this.map)
    }
}