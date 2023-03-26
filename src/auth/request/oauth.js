import Request from "./request.js";
import * as storage from "../storage.js";
import config from "../../config.js";
import fetch from "node-fetch";
export default class OAuthCallbackRequest extends Request {
  constructor(req, res) {
    super(req, res);
  }

  async handleRequest() {
    try {
      if (this.#verifyCookies()) {
        return this.res.sendStatus(403);
      }
      const code = this.req.query["code"];
      const tokens = await this.getOAuthTokens(code);
      const meData = await this.getUserData(tokens);
      const userId = meData.user.id;
      const now = Date.now();
      await this.#storeTokens(userId, tokens, now);
      await this.updateMetadata(userId);
    } catch (e) {
      console.log(e)
      this.res.sendStatus(500);
    }
  }

  #verifyCookies() {
    const discordState = this.req.query["state"];
    const { clientState } = this.req["signedCookies"];
    if (clientState !== discordState) {
      console.error("State verification failed.");
      return true;
    }
  }

  async #storeTokens(userId, tokens, now) {
    await storage.storeDiscordToken(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: now + tokens["expires_in"] * 1000,
    });
  }

  async getOAuthTokens(code) {
    const body = this.getUrlSearchParams(code);
    const response = await this.getResponse(
      config.DISCORD_OAUTH_TOKEN_ENDPOINT,
      body
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `Error fetching OAuth tokens: [${response.status}] ${response.statusText}`
      );
    }
  }

  getUrlSearchParams(code) {
    return new URLSearchParams({
      client_id: config.DISCORD_CLIENT_ID,
      client_secret: config.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: config.DISCORD_REDIRECT_URI,
    });
  }

  async getUserData(tokens) {
    const response = await this.fetchBearer(
      config.DISCORD_OAUTH_SELF_ENDPOINT,
      tokens
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `Error fetching user data: [${response.status}] ${response.statusText}`
      );
    }
  }

  fetchBearer(url, tokens) {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
  }
}
