const {Client, GatewayIntentBits, Partials} = require("discord.js")
const {token} = require('./credentials.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

client.login(token).then(() => console.log('Successful log in!'));