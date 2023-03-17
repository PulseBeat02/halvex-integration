const tokens = new Map()
const whmcs = new Map()

export async function storeDiscordTokens(userId, token) {
    await tokens.set(`discord-${userId}`, token)
}

export async function getDiscordTokens(userId) {
    return tokens.get(`discord-${userId}`)
}

export async function storeAntiForgeryToken(token, expire) {
    await whmcs.set(`whmcs-${token}`, expire)
}

export async function getAntiForgeryToken(token) {
    return whmcs.get(`whmcs-${token}`)
}

