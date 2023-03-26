import Request from "./request.js";
import fetch from "node-fetch";
import config, { WHMCS_CODE_URL } from "../../config.js";
import {getWhmcsToDiscord, setAccessToken} from "../storage.js";

export default class WHMCSTokenRequest extends Request {
  constructor(req, res) {
    super(req, res);
  }

  async handleRequest() {
    try {
      const query = this.req.query
      const code = query.code
      const state = await this.#checkValidState(code);
      if (!state) {
        return this.res.sendStatus(403);
      }
      const securityToken = await this.#getSecurityToken(query)
      const userId = await getWhmcsToDiscord(securityToken)
      const accessToken = state.access_token;
      await setAccessToken(userId, accessToken)
      await this.updateMetadata(userId)
    } catch (e) {
      this.res.sendStatus(500);
    }
  }

  async #getSecurityToken(query) {
    const state = query.state
    const params = new URLSearchParams(state);
    return params.get("security_token")
  }

  async #checkValidState(query) {
    if (!query) return false;
    const params = new URLSearchParams();
    params.append("code", query);
    params.append("client_id", config.WHMCS_OPENID_CLIENT_ID);
    params.append("client_secret", config.WHMCS_OPENID_CLIENT_SECRET);
    params.append("redirect_uri", WHMCS_CODE_URL);
    params.append("grant_type", "authorization_code");
    const code = await fetch(config.WHMCS_API_TOKEN_ENDPOINT, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const header = code.headers.get("content-type").includes("json");
    return header ? await code.json() : false;
  }
}
