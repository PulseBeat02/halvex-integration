import Command from './command.js'

export default class VerifyCommand extends Command {

    constructor() {
        super("verify", "Verify your account", "/verify [Panel Username]", [])
    }

    handle(interaction) {
        super.handle(interaction)
        const user = interaction.user
        const role = this.getActiveUserRole(user)
        if (this.getHalvexConnection(user)) {
            this.addRole(user, role)
        }
    }

    getHalvexConnection(user) {
        const connections = user.connections
        connections.forEach(connection => {
            if (connection.type === "Halvex Connection") {
                return true
            }
        })
        return false
    }

    getActiveUserRole(user) {
        const guild = user.guild
        const roles = guild.roles
        return roles.cache.find(r => r.name === "Active Client")
    }

    addRole(user, role) {
        user.roles.add(role)
    }
}