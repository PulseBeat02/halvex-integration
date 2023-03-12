import {Client, GatewayIntentBits, Partials} from "discord.js";

const credentials = require('./credentials.json')
const JSON = JSON.parse(credentials)

const TOKEN = JSON.get('token')
const WHMCS_API_ENDPOINT = JSON.get('whmcs_api_endpoint')
const WHMCS_USERNAME = JSON.get('whmcs_username')
const WHMCS_PASSWORD = JSON.get('whmcs_password')

export { TOKEN, WHMCS_API_ENDPOINT, WHMCS_USERNAME, WHMCS_PASSWORD };

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
client.login(TOKEN).then(() => console.log('Successful log in!'));