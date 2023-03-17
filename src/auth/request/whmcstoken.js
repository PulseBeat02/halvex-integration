import Request from './request.js'
import * as storage from "../storage.js"

export default class WHMCSTokenRequest extends Request {

    constructor(req, res) {
        super(req, res)
    }

    async handleRequest() {
        try {

            console.log(this.req.originalUrl)

            const state = this.req.query.state
            if (!await this.#checkValidState(state)) {
                this.res.sendStatus(403)
                return
            }

            const info = await this.#extractRedirectInformation(state)
            const url = info.url
            const code = info.code // USE THIS CODE TO EXTRACT INFO

            this.res.send(`<meta http-equiv="refresh" content="0; URL=${url}" />`)

            this.res.sendStatus(204)
        } catch (e) {
            this.res.sendStatus(500)
            console.log(e)
        }
    }

    async #extractRedirectInformation(state) {

        // security_token%3D138r5719ru3e1%26url%3Dhttps://oa2cb.example.com/index&code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const split = state.split("%26")
        if (split.length !== 2) {
            return false
        }

        // security_token%3D138r5719ru3e1 url%3Dhttps://oa2cb.example.com/index&code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const split1 = split[1].split("%3D")
        if (split1.length !== 2) {
            return false
        }

        // url https://oa2cb.example.com/index&code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const url = split1[1]

        // https://oa2cb.example.com/index&code 4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const split2 = url.split("=")
        if (split2.length !== 2) {
            return false
        }

        // 4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const code = split2[1]

        return {
            url: url,
            code: code
        }
    }

    async #checkValidState(state) {

        // security_token%3D138r5719ru3e1%26url%3Dhttps://oa2cb.example.com/index&code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const split = state.split("%26")
        if (split.length !== 2) {
            return false
        }

        // security_token%3D138r5719ru3e1 url%3Dhttps://oa2cb.example.com/index&code=4/P7q7W91a-oMsCeLvIaQm6bTrgtp7
        const split1 = split[0].split("%3D")
        if (split1.length !== 2) {
            return false
        }

        // security_token 138r5719ru3e1
        const token = split1[1]

        const expire = await storage.getAntiForgeryToken(token)
        if (expire === null) {
            return false
        }

        const now = Date.now()

        return now < expire;
    }

}