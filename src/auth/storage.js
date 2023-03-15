const tokens = new Map()
const ids = new Map()

export async function storeDiscordTokens(userId, token) {
    await tokens.set(`discord-${userId}`, token)
}

export async function getDiscordTokens(userId) {
    return tokens.get(`discord-${userId}`)
}

export async function storeClientId(userId, clientId) {
    await ids.set(`discord-${userId}`, clientId)
}

export async function getClientId(userId) {
    return ids.get(`discord-${userId}`)
}
