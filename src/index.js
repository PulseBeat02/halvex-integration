import AuthenticationServer from './auth/server.js';
import createRequest from './auth/register.js';
import config from './config.js';
import {Client, Collection, Events, GatewayIntentBits, REST, Routes} from 'discord.js'
import UnlinkCommand from "./command/UnlinkCommand.js";
import LinkCommand from "./command/LinkCommand.js";

const client = new Client({intents: [GatewayIntentBits.Guilds]});
await client.login(config.DISCORD_TOKEN);
client.commands = new Collection();

const registeredCommands = [new UnlinkCommand(), new LinkCommand()]
const commands = []
for (const index in registeredCommands) {
    const cmd = registeredCommands[index]
    const data = cmd.getCommandData()
    client.commands.set(data.name, cmd);
    commands.push(data.toJSON());
}

const rest = new REST().setToken(config.DISCORD_TOKEN);
(async () => {
    try {
        const key =
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID)
        const options = {body: commands}
        await rest.put(key, options,);
    } catch (error) {
        console.error(error);
    }
})();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
});


const server = new AuthenticationServer();
server.start();
createRequest();

export default client
