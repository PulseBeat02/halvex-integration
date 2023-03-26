// @ts-ignore
import crypto from "crypto";

const tokens = new Map();
const algorithm = "aes-256-cbc";
const vector = crypto.randomBytes(16);
const key = crypto.randomBytes(32);

export async function storeToken(userId, discord, whmcs) {
  const token = { discord_token: { discord, userId }, whmcs, expire: Date.now()}
  const encrypted = encrypt(JSON.stringify(token))
  tokens.set(`token-${userId}`, encrypted)
}

export async function getToken(userId) {
  const data = await tokens.get(`token-${userId}`)
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
