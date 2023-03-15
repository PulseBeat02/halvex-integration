const tokens = new Map()
const ids = new Map()

export async function storeDiscordTokens(userId, tokens) {
    await tokens.set(`discord-${userId}`, tokens)
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
