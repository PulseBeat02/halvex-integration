import Request from './request.js';
import crypto from 'crypto';
import config from '../../config.js';

const MAX_AGE = 1000 * 60 * 5;
export default class LinkedRoleRequest extends Request {
  constructor(req, res) {
    super(req, res);
  }

  handleRequest() {
    const { url, state } = this.#getOAuthUrl();
    this.res.cookie('clientState', state, { maxAge: MAX_AGE, signed: true });
    this.res.redirect(url);
  }

  #getOAuthUrl() {
    const state = crypto.randomUUID();
    const url = this.#generateParameters(state);
    return { state, url: url.toString() };
  }

  #generateParameters(state) {
    const url = new URL(config.DISCORD_OAUTH_AUTHORIZE_ENDPOINT);
    url.searchParams.set('client_id', config.DISCORD_CLIENT_ID);
    url.searchParams.set('redirect_uri', config.REDIRECT_URL);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('scope', 'role_connections.write identify');
    url.searchParams.set('prompt', 'consent');
    return url;
  }
}
