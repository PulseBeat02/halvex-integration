const Command = require('./command.js');

class VerifyCommand extends Command {

    constructor() {
        super("verify", "Verify your account", "/verify [Panel Username]", []);
    }

    public handle(interaction) {
        super.handle(interaction);
        const user = interaction.user
        const role = this.getActiveUserRole(user)
        if (this.getHalvexConnection(user)) {
            this.addRole(user, role)
        }
    }

    private getHalvexConnection(user) {
        const connections = user.connections
        connections.forEach(connection => {
            if (connection.type === "Halvex Connection") {
                return true
            }
        })
        return false
    }

    private getActiveUserRole(user) {
        const guild = user.guild
        const roles = guild.roles
        return roles.cache.find(r => r.name === "Active Client")
    }

    private addRole(user, role) {
        user.roles.add(role)
    }
}