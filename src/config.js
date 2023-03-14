import * as dotenv from 'dotenv'
import localtunnel from 'localtunnel';

const tunnel = await localtunnel({ port: 3000 });
const redirect_uri = tunnel.url + '/discord-oauth-callback';
const verification_uri = tunnel.url + '/linked-role';

console.log('Redirect URL: ' + redirect_uri);
console.log('Verification URL: ' + verification_uri);

dotenv.config({
    path: '../../.env'
})

const config = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI: redirect_uri,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    WHMCS_API_ENDPOINT: process.env.WHMCS_API_ENDPOINT,
    WHMCS_API_IDENTIFIER: process.env.WHMCS_API_IDENTIFIER,
    WHMCS_API_SECRET: process.env.WHMCS_API_SECRET,
    WHMCS_API_ACCESS_KEY: process.env.WHMCS_API_ACCESS_KEY,
};

export default config;