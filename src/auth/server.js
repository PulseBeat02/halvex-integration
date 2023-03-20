import express from "express";
import cookieParser from "cookie-parser";
import LinkedRoleRequest from "./request/linkedrole.js";
import UpdateMetaDataRequest from "./request/updatemetadata.js";
import OAuthCallbackRequest from "./request/oauth.js";
import WHMCSTokenRequest from "./request/whmcstoken.js";

import config from "../config.js";

export default class AuthenticationServer {
  constructor() {}

  start() {
    this.app = express();
    this.#setCookieParser();
    this.#addLinkedRole();
    this.#addOauthCallback();
    this.#addOauthMetaData();
    this.#addListenPort();
    this.#confirmWHMCSToken();
  }

  #setCookieParser() {
    this.app.use(cookieParser(config.COOKIE_SECRET));
  }

  #addLinkedRole() {
    this.app.get("/linked-role", async (req, res) => {
      const request = new LinkedRoleRequest(req, res);
      await request.handleRequest();
    });
  }

  #addOauthCallback() {
    this.app.get("/discord-oauth-callback", async (req, res) => {
      const request = new OAuthCallbackRequest(req, res);
      await request.handleRequest();
    });
  }

  #addOauthMetaData() {
    this.app.post("/update-metadata", async (req, res) => {
      const request = new UpdateMetaDataRequest(req, res);
      await request.handleRequest();
    });
  }

  #confirmWHMCSToken() {
    this.app.get("/code", async (req, res) => {
      const request = new WHMCSTokenRequest(req, res);
      await request.handleRequest();
    });
  }

  #addListenPort() {
    this.app.listen(config.DISCORD_PORT, () => {
      console.log(`Express app listening on ${config.DISCORD_PORT}`);
    });
  }
}
