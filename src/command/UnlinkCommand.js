import {EmbedBuilder} from 'discord.js'
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
        const embed =
            this.createEmbedMessage("To unlink a Halvex Account from Discord, follow these steps:\n" +
                "\n" +
                "Navigate to User Settings >>> Authorized Apps\n" +
                "\n" +
                "In the \"Authorized Apps\" section, you'll see a list of all the third-party applications and services linked to your Discord account.\n" +
                "\n" +
                "Look for the entry related to Halvex in the list of authorized apps. It should have the Halvex logo or name next to it.\n" +
                "\n" +
                "Once you've identified the Halvex entry, click on \"Deauthorize\".\n" +
                "\n" +
                "Discord will then prompt you to confirm the action. Click \"Confirm\" or \"Yes\" to proceed with the unlinking process.\n" +
                "\n" +
                "After confirming, Discord will revoke the access for Halvex, and your Halvex Account will be unlinked from your Discord account.\n" +
                "\n" +
                "Please note that unlinking your Halvex Account from Discord will disconnect any integrations or functionalities between the two platforms.")
        this.originalInteraction = interaction
        await interaction.reply({embeds: [embed], ephemeral: true})
    }

    createEmbedMessage(description) {
        return new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Halvex Unlinking Guide')
            .setAuthor({
                name: 'Halvex Linker Bot',
                iconURL: 'https://halvex.net/img/header/logo.png',
                url: 'https://halvex.net/index.html'
            })
            .setDescription(description)
            .setTimestamp()
    }

    async checkRole(interaction) {
        const user = await interaction.guild.members.fetch(interaction.user.id)
        return user.roles.cache.has('1070703004795277392')
    }
}
