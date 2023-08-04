import {EmbedBuilder} from 'discord.js'
import Command from "./Command.js";

export default class LinkCommand extends Command {

    constructor() {
        super("link", "Links your Discord account from the Halvex panel");
    }

    async execute(interaction) {
        await this.handleInteraction(interaction)
    }

    async handleInteraction(interaction) {
        const embed =
            this.createEmbedMessage("Click on the server name in the server list on the left-hand side of the Discord window to access the server.\n" +
                "\n" +
                "Inside the server, locate the server menu (usually represented by a down arrow next to the server name) and click on it.\n" +
                "\n" +
                "From the server menu, select \"Linked Roles.\"\n" +
                "\n" +
                "Look for the Active Client role in the Linked Roles section and click on it.\n" +
                "\n" +
                "When you click on the Active Client role, Discord will open a web page or pop-up window, redirecting you to \"dcg-link.halvex.live.\"\n" +
                "\n" +
                "At this point, you will be prompted to sign into your Discord account using OAuth2. Follow the on-screen instructions to sign in.\n" +
                "\n" +
                "After signing in to your Discord account, the next step will be to sign into your Halvex account. Enter your Halvex account credentials and log in.\n" +
                "\n" +
                "Once you have successfully signed in to both your Discord and Halvex accounts, the link between the two accounts will be established.\n" +
                "\n" +
                "You will now be granted the role of Active Client in the Discord server.\n" +
                "\n" +
                "Congratulations! You have successfully linked your Halvex account to Discord and received the Active Client role. Enjoy the benefits and features associated with being an Active Client on the server.\n" +
                "\n" +
                "To unlink, use /unlink")
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
