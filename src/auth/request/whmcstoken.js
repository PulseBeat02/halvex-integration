import Request from './request.js'
import * as storage from "../storage.js"

export default class WHMCSTokenRequest extends Request {

    constructor(req, res) {
        super(req, res)
    }

    async handleRequest() {
        try {

            const query = this.req.query
            const state = query.state
            if (!await this.#checkValidState(state)) {
                this.res.sendStatus(403)
                return
            }

            const code = query.code
            if (code === undefined) {
                this.res.sendStatus(403)
                return
            }

            console.log(this.req.url)
            console.log(code)
            // use code


            this.res.sendStatus(204)
        } catch (e) {
            this.res.sendStatus(500)
            console.log(e)
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