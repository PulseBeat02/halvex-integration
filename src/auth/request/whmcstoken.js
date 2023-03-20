import Request from "./request.js";
import LinkedRoleRequest from "./linkedrole.js";
import fetch from "node-fetch";
import config, {WHMCS_CODE_URL} from "../../config.js";
import {access} from "fs";

export default class WHMCSTokenRequest extends Request {
    constructor(req, res) {
        super(req, res);
    }

    async handleRequest() {
        try {
            const query = this.req.query;
            const state = await this.#checkValidState(query.code);
            if (!state) {
                this.res.sendStatus("The token provided is invalid!")
            }
            const access_token = state.access_token
            const json = await this.#getUserInfo(access_token)
            const products = json.products // array
            console.log(products)
        } catch (e) {
            this.res.sendStatus(500);
        }
    }

    async #getUserInfo(token) {
        const params = new URLSearchParams()
        params.append("action", 'GetClientsProducts');
        params.append("identifier", config.WHMCS_API_IDENTIFIER);
        params.append("secret", config.WHMCS_API_SECRET);
        params.append("responsetype", "json");
        const url = config.WHMCS_API_ENDPOINT + "?" + params
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        const json = await response.text()
        return JSON.parse(json)
    }

    async #checkValidState(query) {
        if (!query) return false;
        const params = new URLSearchParams();
        params.append("code", query);
        params.append("client_id", config.WHMCS_OPENID_CLIENT_ID);
        params.append("client_secret", config.WHMCS_OPENID_CLIENT_SECRET);
        params.append("redirect_uri", WHMCS_CODE_URL);
        params.append("grant_type", "authorization_code");
        const code = await fetch("https://test.atheris.lol/oauth/token.php", {
            method: "POST",
            body: params,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });
        const header = code.headers.get("content-type").includes("json")
        return header ? await code.json() : false
    }
}
