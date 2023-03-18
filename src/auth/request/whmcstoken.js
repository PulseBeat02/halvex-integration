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
            const checkVaidState = await this.#checkValidState(query.code)
            if (!checkVaidState) console.log(checkVaidState)
            console.log(query)
            // use code

        } catch (e) {
            this.res.sendStatus(500)
            console.log(e)
        }
    }


    async #checkValidState(qcode) {
        if (!qcode) return false
        const params = new URLSearchParams()
        params.append("code", qcode)
        params.append("client_id", config.WHMCS_OPENID_CLIENT_ID)
        params.append("client_secret", config.WHMCS_OPENID_CLIENT_SECRET)
        params.append("redirect_uri", WHMCS_CODE_URL)
        params.append("grant_type", "authorization_code")
        const code =  fetch("https://test.atheris.lol/oauth/token.php", {
            method: "POST",
            body: params,
             headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
        })
        console.log(await code)
       // return await code
       /* 
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
    }*/

    }

}