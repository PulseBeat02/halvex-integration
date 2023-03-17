import fetch from "node-fetch";
import config from "../config.js";
import crypto from "crypto";
import { WHMCS_CODE_URL, DISCORD_VERIFICATION_URL } from "../config.js";

export default class WHMCSRequest {
  request(params) {
    const request = this.#createRequest();
    const url = config.WHMCS_API_ENDPOINT + "?" + this.#parseQueries(params);
    return fetch(url, request)
      .then((response) => response.json())
      .then((json) => {
        return json;
      });
  }

  #parseQueries(headers) {
    const params = new URLSearchParams();
    params.append("identifier", config.WHMCS_API_IDENTIFIER);
    params.append("secret", config.WHMCS_API_SECRET);
    params.append("responsetype", "json");

    Object.keys(headers).forEach((key) => {
      params.append(key, headers[key]);
    });

    return params;
  }

  #createRequest() {
    const method = "GET";
    const header = this.#createHeader();
    return {
      method: method,
      headers: header,
    };
  }

  #createHeader() {
    return {
      "Content-Type": "application/json",
    };
  }
}

export function generateUrl() {
    const token = crypto.randomBytes(32).toString("hex");

    const params = new URLSearchParams();
    params.append("client_id", config.WHMCS_OPENID_CLIENT_ID);
    params.append("response_type", "code");
    //params.append("scope", "openid%20profile%20email&");
    params.append("redirect_uri", WHMCS_CODE_URL);
    params.append("state", `security_token%3D${token}%26url%3D${DISCORD_VERIFICATION_URL}` );

    const url = `${config.WHMCS_AUTHORIZE_ENDPOINT}?${params}`;
    console.log(url);
  }