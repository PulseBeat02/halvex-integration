import {Client, GatewayIntentBits, Partials} from "discord.js";
import credentials from "./credentials.json" assert {type: "json"};

const TOKEN = credentials.token
const WHMCS_API_ENDPOINT = credentials.whmcs_api_endpoint
const WHMCS_USERNAME = credentials.whmcs_username
const WHMCS_PASSWORD = credentials.whmcs_password

export {TOKEN, WHMCS_API_ENDPOINT, WHMCS_USERNAME, WHMCS_PASSWORD};

const client = new Client({intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel]});
client.login(TOKEN).then(() => console.log('Successful log in!'));