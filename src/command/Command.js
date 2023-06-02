import {SlashCommandBuilder} from "discord.js";

export default class Command {

    constructor(name, description) {
        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
    }

    async execute(interaction) {
    }

    getCommandData() {
        return this.data;
    }
}