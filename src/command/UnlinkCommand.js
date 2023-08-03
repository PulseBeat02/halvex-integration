import {ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events} from 'discord.js'
import {checkDiscordUserExists, getAccessToken, getDiscordToken} from '../auth/storage.js'
import client from '../index.js'
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
        const verified = await this.checkRole(interaction)
        if (!verified) {
            const embed = this.createEmbedMessage('You have not linked your Discord account to the Halvex panel yet!')
            await interaction.reply({embeds: [embed], ephemeral: true})
            return
        }
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
            .setTitle('Halvex')
            .setAuthor({
                name: 'Halvex Linker Bot',
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
        const user = interaction.member
        let role;
        for (const roles of user.roles.cache) {
            if (roles.name === 'Active Client') {
                role = roles
            }
        }
        if (role !== undefined) {
            await user.roles.delete(role)
        }
        const embed = this.createEmbedMessage('Your Discord account has been unlinked from the Halvex panel!')
        await this.originalInteraction.editReply({
            embeds: [embed],
            components: [],
            ephemeral: true
        })
    }

    async checkRole(interaction) {
        const user = interaction.member
        for (const roles of user.roles.cache) {
            if (roles.name === 'Active Client') {
                return true
            }
        }
        return false
    }
}