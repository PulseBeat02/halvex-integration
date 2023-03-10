const API_ENDPOINT = ""

class WHMCSRequest {
    constructor(options) {
        this.options = options
    }

    createRequest() {
        const options = this.createOptions();
        fetch(API_ENDPOINT, options)
            .then(res => res.json())
            .then(data => {
                return JSON.parse(data)
            })
            .then(err => console.log(err));
    }

    private createOptions() {
        return {
            headers: Array.from(this.options, ([name, value]) => ({name, value}))
        }
    }
}

class RequestBuilder {
    constructor() {
        this.map = new Map();
    }

    addRequestParameter(key, value) {
        this.map.set(key, value);
        return this;
    }

    build() {
        return new WHMCSRequest(this.map);
    }
}