import {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, Events} from 'discord.js'
import {getAccessToken, getDiscordToken} from './../auth/storage.js'
import client from './../index.js'
import config from '../config.js';
import fetch from 'node-fetch';

export default {
    data: new SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Unlinks your Discord account from the Halvex panel'),
    async execute(interaction) {
        await this.handleInteraction(interaction)
    },
    async handleInteraction(interaction) {
        const user = interaction.user
        if (!await this.checkExists(user)) {
            await interaction.reply({content: 'You are not linked to a Halvex account.', ephemeral: true})
            return
        }
        const yes = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('Yes')
            .setStyle('SUCCESS')
        const no = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('No')
            .setStyle('DANGER')
        const row = new ActionRowBuilder().addComponents(yes, no);
        client.on(Events.InteractionCreate, interaction => this.handleButtonInteraction(interaction));
        const content = 'Are you sure you want to unlink your Discord account from the Halvex panel?'
        await interaction.reply({content: content, components: [row]}, true)
    },
    async handleButtonInteraction(interaction) {
        if (!interaction.isButton()) {
            return;
        }
        if (interaction.customId === 'yes') {
            await this.handleUnlink(interaction)
        } else if (interaction.customId === 'no') {
            await this.handleLink(interaction)
        }
    },
    async handleLink(interaction) {
        interaction.reply({content: 'Cancelled unlinking process!', ephemeral: true})
    },
    async handleUnlink(interaction) {
        const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
        const user = interaction.user
        const userId = user.userId
        const accessToken = getDiscordToken(userId)
        const method = 'PUT';
        const body = JSON.stringify(this.getMetaDataBody());
        const headers = this.getMetaDataHeaders(accessToken);
        const response = await this.fetchMetaDataResponse(
            url,
            method,
            body,
            headers
        );
        let role;
        for (const roles of user.roles.cache) {
            if (roles.name === 'Active Client') {
                role = roles
            }
        }
        if (role !== undefined) {
            await user.roles.delete(role)
        }
        if (response.ok) {
            await interaction.reply({
                content: 'Your Discord account has been unlinked from the Halvex panel!',
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: 'There was an error unlinking your Discord account from the Halvex panel. Please try again later.',
                ephemeral: true
            })
        }
    },
    getMetaDataHeaders(accessToken) {
        return {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
    },
    fetchMetaDataResponse(url, method, body, headers) {
        return fetch(url, {
            method: method,
            body: body,
            headers: headers,
        });
    },
    getMetaDataBody() {
        return {
            platform_name: 'Halvex Linker Bot',
            halvexservices: 0,
        };
    },
    checkExists(user) {
        return getAccessToken(user.userId)
    }
}
