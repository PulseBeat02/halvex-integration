import crypto from 'crypto'

const tokens = new Map()
const algorithm = 'aes-256-cbc';
const vector = crypto.randomBytes(16);
const key = crypto.randomBytes(32)

const cipher = crypto.createCipheriv(algorithm, key, vector)
const decipher = crypto.createDecipheriv(algorithm, key, vector);

export async function storeDiscordTokens(userId, token) {
    const json = JSON.stringify(token)
    await tokens.set(`discord-${userId}`, encrypt(json))
}

export async function getDiscordTokens(userId) {
    const token = decrypt(await tokens.get(`discord-${userId}`))
    console.log(token)
    return JSON.parse(token)
}

function encrypt(plaintext) {
    return cipher.update(plaintext, "utf-8", "hex") + cipher.final("hex");
}

function decrypt(ciphertext) {
    return decipher.update(ciphertext, "hex", "utf-8") + decipher.final("utf8");
}