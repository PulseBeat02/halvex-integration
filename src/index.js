import {Client, GatewayIntentBits, Partials} from "discord.js"
import config from './config.js'

const client = new Client({intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel]})
client.login(config.DISCORD_TOKEN).then(() => console.log('Successful log in!'))