import Request from "./request.js";
import LinkedRoleRequest from "./linkedrole.js";
import fetch from "node-fetch";
import config, { WHMCS_CODE_URL } from "../../config.js";
import { access } from "fs";

export default class WHMCSTokenRequest extends Request {
  constructor(req, res) {
    super(req, res);
  }

  async handleRequest() {
    try {
      const query = this.req.query;
      const checkkVaidState = await this.#checkValidState(query.code);
      if (!checkkVaidState) {
       // this.res.redirect('/linked-role')
       this.res.sendStatus("The token provided is invalid!")
      }

      const access_token = checkkVaidState.access_token
      console.log(access_token)
    } catch (e) {
      this.res.sendStatus(500);
    }
  }

  #parseJwt(token) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  }

  async #checkValidState(query) {
    if (!query) return false;
    const params = new URLSearchParams();
    params.append("code", query);
    params.append("client_id", config.WHMCS_OPENID_CLIENT_ID);
    params.append("client_secret", config.WHMCS_OPENID_CLIENT_SECRET);
    params.append("redirect_uri", WHMCS_CODE_URL);
    params.append("grant_type", "authorization_code");
    const code = await fetch("https://test.atheris.lol/oauth/token.php", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return (await code).json()
    if (code.headers.get("content-type").includes("json")) {
      await code.json();
    } else {
      return false;
    }
  }
}
