const {Client, GatewayIntentBits, Partials} = require("discord.js")
const {TOKEN} = require('./credentials.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

client.login(TOKEN).then(() => console.log('Successful log in!'));