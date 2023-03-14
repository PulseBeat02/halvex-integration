import Request from "./request.js";
import * as storage from "../storage.js";
import config from "../../config.js";
import fetch from "node-fetch";

const USER_OAUTH_URL = 'https://discord.com/api/v10/oauth2/@me'
export default class OAuthCallbackRequest extends Request {

    constructor(req, res) {
        super(req, res);
    }

    async handleRequest() {
        try {
            if (this.#verifyCookies()) {
                return this.res.sendStatus(403);
            }
            const code = this.req.query['code'];
            const tokens = await this.getOAuthTokens(code);
            const meData = await this.getUserData(tokens);
            const userId = meData.user.id;
            const now = Date.now()
            await this.#storeTokens(userId, tokens, now);
            await this.updateMetadata(userId);
            this.res.send('You did it! Now go back to Discord.');
        } catch (e) {
            console.error(e);
            this.res.sendStatus(500);
        }
    }

    #verifyCookies() {
        const discordState = this.req.query['state'];
        const {clientState} = this.req.signedCookies;
        if (clientState !== discordState) {
            console.error('State verification failed.');
            return true
        }
    }

    #storeTokens(userId, tokens, now) {
        return storage.storeDiscordTokens(userId, {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: now + tokens.expires_in * 1000,
        });
    }

    async getOAuthTokens(code) {
        const body = this.getUrlSearchParams(code);
        const response = await this.getResponse(this.oauthUrl, body);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
        }
    }

    getUrlSearchParams(code) {
        return new URLSearchParams({
            client_id: config.DISCORD_CLIENT_ID,
            client_secret: config.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: config.DISCORD_REDIRECT_URI,
        });
    }


    async getUserData(tokens) {
        const response = await this.fetchBearer(USER_OAUTH_URL, tokens);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
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