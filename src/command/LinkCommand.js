import {EmbedBuilder} from 'discord.js'
import Command from "./Command.js";

export default class LinkCommand extends Command {

    originalInteraction

    constructor() {
        super("link", "Links your Discord account from the Halvex panel");
    }

    async execute(interaction) {
        await this.handleInteraction(interaction)
    }

    async handleInteraction(interaction) {
        const embed =
            this.createEmbedMessage("")
        this.originalInteraction = interaction
        await interaction.reply({embeds: [embed], ephemeral: true})
    }

    createEmbedMessage(description) {
        return new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Halvex Linking Guide')
            .setAuthor({
                name: 'Halvex Linker Bot',
                iconURL: 'https://halvex.net/img/header/logo.png',
                url: 'https://halvex.net/index.html'
            })
            .setDescription(description)
            .setTimestamp()
    }
}
