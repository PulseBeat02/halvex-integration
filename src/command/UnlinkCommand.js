import {ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events} from 'discord.js'
import {getAccessToken, getDiscordToken} from '../auth/storage.js'
import client from '../index.js'
import config from '../config.js';
import fetch from 'node-fetch';
import Command from "./Command.js";

export default class UnlinkCommand extends Command {

    originalInteraction

    constructor() {
        super("unlink", "Unlinks your Discord account from the Halvex panel");
    }

    async execute(interaction) {
        await this.handleInteraction(interaction)
    }

    async handleInteraction(interaction) {
        const user = interaction.user
        // if (!await this.checkExists(user)) {
        //     await interaction.reply({content: 'You are not linked to a Halvex account.', ephemeral: true})
        //     return
        // }
        const yes = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel('Yes')
            .setStyle('Success')
        const no = new ButtonBuilder()
            .setCustomId('no')
            .setLabel('No')
            .setStyle('Danger')
        const row = new ActionRowBuilder().addComponents(yes, no);
        client.on(Events.InteractionCreate, interaction => this.handleButtonInteraction(interaction));
        const embed =
            this.createEmbedMessage('Are you sure you want to unlink your Discord account from the Halvex panel?')
        this.originalInteraction = interaction
        await interaction.reply({embeds: [embed], components: [row], ephemeral: true})
    }

    createEmbedMessage(description) {
        return new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Halvex Unlinking')
            .setAuthor({
                name: 'Halvex Unlinking',
                iconURL: 'https://halvex.net/img/header/logo.png',
                url: 'https://halvex.net/index.html'
            })
            .setDescription(description)
            .setTimestamp()
    }

    async handleButtonInteraction(interaction) {
        if (!interaction.isButton()) {
            return;
        }
        if (interaction.customId === 'yes') {
            await this.handleUnlink(interaction)
        } else if (interaction.customId === 'no') {
            await this.handleLink()
        }
    }

    async handleLink() {
        const embed = this.createEmbedMessage('Cancelled unlinking process!')
        await this.originalInteraction.editReply({
            embeds: [embed], components: [], ephemeral: true
        })
    }

    async handleUnlink(interaction) {
        const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
        const user = interaction.member
        const userId = user.userId
        const accessToken = getDiscordToken(userId)
        const method = 'PUT';
        const body = JSON.stringify(this.getMetaDataBody());
        const headers = this.getMetaDataHeaders(accessToken);
        const response = await this.fetchMetaDataResponse(url, method, body, headers);
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
            const embed = this.createEmbedMessage('Your Discord account has been unlinked from the Halvex panel!')
            await this.originalInteraction.editReply({
                embeds: [embed],
                components: [],
                ephemeral: true
            })
        } else {
            const embed = this.createEmbedMessage('There was an error unlinking your Discord account from the Halvex panel. Please try again later.')
            await this.originalInteraction.editReply({
                embeds: [embed],
                components: [],
                ephemeral: true
            })
        }
    }

    async getMetaDataHeaders(accessToken) {
        return {
            Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json',
        };
    }

    async fetchMetaDataResponse(url, method, body, headers) {
        return fetch(url, {
            method: method, body: body, headers: headers,
        });
    }

    async getMetaDataBody() {
        return {
            platform_name: 'Halvex Linker Bot', halvexservices: 0,
        };
    }

    async checkExists(user) {
        return getAccessToken(user.userId)
    }
}