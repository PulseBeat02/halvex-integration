import fetch from "node-fetch";
import * as storage from "../storage.js";
import config, {DISCORD_VERIFICATION_URL, WHMCS_CODE_URL} from "../../config.js";
import crypto from "crypto";
import {getAccessToken, setAccessToken, storeWhmcsToDiscord} from "../storage.js";

export default class Request {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  handleRequest() {}

  getResponse(url, body) {
    const method = "POST";
    const headers = this.#getResponseHeaders();
    return this.#fetchResponse(url, body, method, headers);
  }

  #fetchResponse(url, body, method, headers) {
    return fetch(url, {
      body,
      method: method,
      headers: headers,
    });
  }

  #getResponseHeaders() {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  async updateMetadata(userId) {
    try {
      const discordAccessToken = await storage.getDiscordToken(userId);
      const whmcsAccessToken = await getAccessToken(userId)
      if (whmcsAccessToken === undefined) {
        const whmcs = await this.#generateWHMCSUrl(userId);
        const url = whmcs.url
        const token = whmcs.token
        await storeWhmcsToDiscord(token, userId)
        this.res.redirect(url);
        return
      }
      const json = await this.#getUserInfo(whmcsAccessToken);
      const products = Object.keys(json["products"]).length
      const metadata = {
        halvexservices: products
      };
      await this.#pushMetadata(userId, discordAccessToken, metadata);
    } catch (e) {
      this.res.sendStatus(500);
    }
  }

  async #getUserInfo(token) {
    const params = new URLSearchParams();
    params.append("action", "GetClientsProducts");
    params.append("identifier", config.WHMCS_API_IDENTIFIER);
    params.append("secret", config.WHMCS_API_SECRET);
    params.append("responsetype", "json");
    const url = config.WHMCS_API_ENDPOINT + "?" + params;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await response.text();
    return JSON.parse(json);
  }

  async #generateWHMCSUrl(userId) {
    const whmcs = this.#generateWHMCSAntiForgeryToken();
    await setAccessToken(userId, whmcs);
    const params = await this.#createURLSearchParams(whmcs);
    return {
      url: config.WHMCS_AUTHORIZE_ENDPOINT + "?" + params,
      token: whmcs
    };
  }

  async #createURLSearchParams(token) {
    const state = `security_token%3D${token}%26url%3D${DISCORD_VERIFICATION_URL}`;
    const scope = "openid%20profile%20email";
    return `client_id=${config.WHMCS_OPENID_CLIENT_ID}&response_type=code&scope=${scope}&redirect_uri=${WHMCS_CODE_URL}&state=${state}`;
  }

  #generateWHMCSAntiForgeryToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  async #pushMetadata(userId, tokens, metadata) {
    const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
    const accessToken = await this.#getAccessToken(userId, tokens);
    const method = "PUT";
    const body = JSON.stringify(this.#getMetaDataBody(metadata));
    const headers = this.#getMetaDataHeaders(accessToken);
    const response = await this.#fetchMetaDataResponse(
      url,
      method,
      body,
      headers
    );
    if (!response.ok) {
      throw new Error(
        `Error pushing discord metadata: [${response.status}] ${response.statusText}`
      );
    }
    this.req.send("Succesfully linked Halvex with Discord! Go back into your Discord to enjoy your role!")
  }

  #fetchMetaDataResponse(url, method, body, headers) {
    return fetch(url, {
      method: method,
      body: body,
      headers: headers,
    });
  }

  #getMetaDataHeaders(accessToken) {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }

  #getMetaDataBody(metadata) {
    return {
      platform_name: "Halvex Linker Bot",
      metadata,
    };
  }

  async #getAccessToken(userId, tokens) {
    const now = Date.now();
    const expire = tokens.expires_at;
    if (now > expire) {
      return await this.#handleExpiredToken(tokens, userId);
    }
    return tokens.access_token;
  }

  async #handleExpiredToken(tokens, userId) {
    const body = this.#createSearchParameters(tokens);
    const response = await this.getResponse(config.DISCORD_OAUTH_TOKEN_ENDPOINT, body);
    if (response.ok) {
      return await this.#refreshToken(response, userId);
    } else {
      throw new Error(
        `Error refreshing access token: [${response.status}] ${response.statusText}`
      );
    }
  }

  async #refreshToken(response, userId) {
    const tokens = await response.json();
    const now = Date.now();
    tokens.expires_at = now + tokens['expires_in'] * 1000;
    await storage.storeDiscordToken(userId, tokens);
    return tokens.access_token;
  }

  #createSearchParameters(tokens) {
    return new URLSearchParams({
      client_id: config.DISCORD_CLIENT_ID,
      client_secret: config.DISCORD_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    });
  }
}
