import crypto from 'crypto'
import {WHMCS_CODE_URL, DISCORD_VERIFICATION_URL} from "../src/config.js";
import config from "../src/config.js";

export function generateUrl() {

    const token = crypto.randomBytes(32).toString('hex')

    const params = new URLSearchParams()
    params.append('client_id', config.WHMCS_OPENID_CLIENT_ID)
    params.append('response_type', 'code')
    params.append('scope', 'openid%20profile%20email&')
    params.append('redirect_uri', WHMCS_CODE_URL)
    params.append('state', `security_token%3D${token}%26url%3D${DISCORD_VERIFICATION_URL}`)

    const url = `${config.WHMCS_AUTHORIZE_ENDPOINT}?${params}`
    console.log(url)

}

