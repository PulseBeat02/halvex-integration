import fetch from "node-fetch";
import config from "../config.js";

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
