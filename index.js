import {Client, GatewayIntentBits, Partials} from "discord.js";
import credentials from "./credentials.json" assert {type: "json"};

const TOKEN = credentials.token
const WHMCS_API_ENDPOINT = credentials.whmcs_api_endpoint
const WHMCS_IDENTIFIER = credentials.whmcs_identifier
const WHMCS_SECRET = credentials.whmcs_secret
const WHMCS_ACCESS_KEY = credentials.whmcs_access_key

export {TOKEN, WHMCS_API_ENDPOINT, WHMCS_IDENTIFIER, WHMCS_SECRET, WHMCS_ACCESS_KEY};

const client = new Client({intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel]});
client.login(TOKEN).then(() => console.log('Successful log in!'));