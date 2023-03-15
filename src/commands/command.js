import SlashCommandBuilder from "discord.js"

export default class Command {
    constructor(name, description, permission) {
        this.name = name
        this.description = description
        this.permission = permission
        module.exports = {
            data: this.createCommandBuilder(),
            async execute(interaction) {
                await this.handle(interaction)
            },
        }
    }

    createCommandBuilder() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultPermission(this.permission)
    }

    handle(interaction) {
        const user = interaction.user
        console.log(`Received user interaction from ${user}`)
    }
}