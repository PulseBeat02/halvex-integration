import * as dotenv from 'dotenv'

dotenv.config()

export const DISCORD_REDIRECT_URL = `http://localhost:${process.env.DISCORD_PORT}/discord-oauth-callback`
export const DISCORD_VERIFICATION_URL = `http://localhost:${process.env.DISCORD_PORT}/linked-role`
export const WHMCS_CODE_URL = `http://localhost:${process.env.DISCORD_PORT}/code`

console.log(`Redirect URL: ${DISCORD_REDIRECT_URL}`)
console.log(`Verification URL: ${DISCORD_VERIFICATION_URL}`)

const config = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI: DISCORD_REDIRECT_URL,
    DISCORD_PORT: process.env.DISCORD_PORT,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    WHMCS_API_ENDPOINT: process.env.WHMCS_API_ENDPOINT,
    WHMCS_AUTHORIZE_ENDPOINT: process.env.WHMCS_AUTHORIZE_ENDPOINT,
    WHMCS_API_IDENTIFIER: process.env.WHMCS_API_IDENTIFIER,
    WHMCS_API_SECRET: process.env.WHMCS_API_SECRET,
    WHMCS_API_ACCESS_KEY: process.env.WHMCS_API_ACCESS_KEY,
    WHMCS_OPENID_CLIENT_ID: process.env.WHMCS_OPENID_CLIENT_ID,
    WHMCS_OPENID_CLIENT_SECRET: process.env.WHMCS_OPENID_CLIENT_SECRET,
}

export default config