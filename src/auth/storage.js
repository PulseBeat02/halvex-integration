import crypto from 'crypto';
import FileSystem from 'fs';

let discordAccessTokens = new Map();
let whmcsAccessTokens = new Map()
let whmcsToDiscord = new Map();

const algorithm = 'aes-256-cbc';
const vector = crypto.randomBytes(16);
const key = crypto.randomBytes(32);

export async function setAccessToken(userId, whmcs) {
    const encrypted = encrypt(JSON.stringify(whmcs));
    whmcsAccessTokens.set(`whmcs-${userId}`, encrypted);
    deserialize()
}

export async function getAccessToken(userId) {
    const data = await whmcsAccessTokens.get(`whmcs-${userId}`);
    if (data === undefined) {
        return undefined
    }
    const token = decrypt(data);
    return JSON.parse(token);
}

export async function setDiscordToken(userId, discord) {
    const encrypted = encrypt(JSON.stringify(discord));
    discordAccessTokens.set(`discord-${userId}`, encrypted)
    deserialize()
}

export async function getDiscordToken(userId) {
    const data = await discordAccessTokens.get(`discord-${userId}`)
    if (data === undefined) {
        return undefined
    }
    const token = decrypt(data);
    return JSON.parse(token);
}

export async function setWhmcsToDiscord(whmcsToken, userId) {
    const encrypted = encrypt(JSON.stringify(userId));
    whmcsToDiscord.set(`convert-${whmcsToken}`, encrypted);
    deserialize()
}

export async function getWhmcsToDiscord(whmcsToken) {
    const data = await whmcsToDiscord.get(`convert-${whmcsToken}`)
    if (data === undefined) {
        return undefined
    }
    const token = decrypt(data);
    return JSON.parse(token);
}

function encrypt(plaintext) {
    const cipher = crypto.createCipheriv(algorithm, key, vector);
    return cipher.update(plaintext, 'utf-8', 'hex') + cipher.final('hex');
}

function decrypt(ciphertext) {
    const decipher = crypto.createDecipheriv(algorithm, key, vector);
    return decipher.update(ciphertext, 'hex', 'utf-8') + decipher.final('utf8');
}

export function serialize() {
    FileSystem.writeFile('discord.json', JSON.stringify(discordAccessTokens), (error) => {
        if (error) throw error;
    });
    FileSystem.writeFile('whmcs.json', JSON.stringify(whmcsAccessTokens), (error) => {
        if (error) throw error;
    });
    FileSystem.writeFile('conversion.json', JSON.stringify(whmcsToDiscord), (error) => {
        if (error) throw error;
    });
}

export function deserialize() {
    FileSystem.readFile('discord.json', (error, data) => {
        if (error) throw error
        whmcsToDiscord = handleData(data)
    });
    FileSystem.readFile('whmcs.json', (error, data) => {
        if (error) throw error
        whmcsToDiscord = handleData(data)
    });
    FileSystem.readFile('conversion.json', (error, data) => {
        if (error) throw error
        whmcsToDiscord = handleData(data)
    });
}

function handleData(data) {
    return data.length === 0 ? new Map() : JSON.parse(data);
}