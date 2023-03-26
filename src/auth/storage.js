import crypto from "crypto";

const discordAccessTokens = new Map();
const whmcsAccessTokens = new Map()
const whmcsToDiscord = new Map();

const algorithm = "aes-256-cbc";
const vector = crypto.randomBytes(16);
const key = crypto.randomBytes(32);

export async function setAccessToken(userId, whmcs) {
  const encrypted = encrypt(JSON.stringify(whmcs));
  whmcsAccessTokens.set(`whmcs-${userId}`, encrypted);
}
export async function getAccessToken(userId) {
  const data = await whmcsAccessTokens.get(`whmcs-${userId}`);
  if (data === undefined) {
      return undefined
  }
  const token = decrypt(data);
  return JSON.parse(token);
}

export async function storeDiscordToken(userId, discord) {
  const encrypted = encrypt(JSON.stringify(discord));
    discordAccessTokens.set(`discord-${userId}`, encrypted)
}

export async function getDiscordToken(userId) {
  const data = await discordAccessTokens.get(`discord-${userId}`)
  if (data === undefined) {
     return undefined
  }
  const token = decrypt(data);
  return JSON.parse(token);
}

export async function storeWhmcsToDiscord(whmcsToken, userId) {
    const encrypted = encrypt(JSON.stringify(userId));
    whmcsToDiscord.set(`convert-${whmcsToken}`, encrypted);
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
  return cipher.update(plaintext, "utf-8", "hex") + cipher.final("hex");
}

function decrypt(ciphertext) {
  const decipher = crypto.createDecipheriv(algorithm, key, vector);
  return decipher.update(ciphertext, "hex", "utf-8") + decipher.final("utf8");
}
