import Request from './request.js'
import * as storage from "../storage.js"
import fetch from "node-fetch"
import config, {WHMCS_CODE_URL} from "../../config.js"

export default class WHMCSTokenRequest extends Request {

    constructor(req, res) {
        super(req, res)
    }

    async handleRequest() {
        try {

            const query = this.req.query
            const json = await this.#checkValidState(query.code)
            if (!json) {
                this.res.sendStatus("The token provided is invalid!")
            }

            const decoded = this.#parseJwt(json.id_token)
            const sub = decoded.sub



        } catch (e) {
            this.res.sendStatus(500)
        }
    }

    #parseJwt(token) {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }

    async #checkValidState(query) {
        if (query === undefined) return false
        const params = new URLSearchParams()
        params.append("code", query)
        params.append("client_id", config.WHMCS_OPENID_CLIENT_ID)
        params.append("client_secret", config.WHMCS_OPENID_CLIENT_SECRET)
        params.append("redirect_uri", WHMCS_CODE_URL)
        params.append("grant_type", "authorization_code")
        const code = fetch("https://test.atheris.lol/oauth/token.php", {
            method: "POST",
            body: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        return (await code).json()
    }

}