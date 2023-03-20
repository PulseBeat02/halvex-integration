import fetch from "node-fetch";
import * as storage from "../storage.ts";
import config from "../../config.js";

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
    const tokens = await storage.getToken(userId);

    let metadata = {};
    try {
      // TODO Get WHMCS Data
    } catch (e) {
      e.message = `Error fetching external data: ${e.message}`;
      console.error(e);
    }

    await this.#pushMetadata(userId, tokens, metadata);
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
    await storage.storeToken(userId, tokens);
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
