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
        const member = interaction.member
        console.log("Received interaction from user " + user.username + " with id " + user.id + " and member " + member.displayName + " with id " + member.id + "")
    }
}