import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_PORT: process.env.DISCORD_PORT,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  REDIRECT_URL: process.env.REDIRECT_URL,
  WHMCS_CODE_URL: process.env.WHMCS_CODE_URL,
  VERIFICATION_URL: process.env.VERIFICATION_URL,
  WHMCS_API_ENDPOINT: process.env.WHMCS_API_ENDPOINT,
  WHMCS_AUTHORIZE_ENDPOINT: process.env.WHMCS_AUTHORIZE_ENDPOINT,
  WHMCS_API_IDENTIFIER: process.env.WHMCS_API_IDENTIFIER,
  WHMCS_API_SECRET: process.env.WHMCS_API_SECRET,
  WHMCS_OPENID_CLIENT_ID: process.env.WHMCS_OPENID_CLIENT_ID,
  WHMCS_OPENID_CLIENT_SECRET: process.env.WHMCS_OPENID_CLIENT_SECRET,
  WHMCS_API_TOKEN_ENDPOINT: process.env.WHMCS_API_TOKEN_ENDPOINT,
  DISCORD_OAUTH_TOKEN_ENDPOINT: process.env.DISCORD_OAUTH_TOKEN_ENDPOINT,
  DISCORD_OAUTH_SELF_ENDPOINT: process.env.DISCORD_OAUTH_SELF_ENDPOINT,
  DISCORD_OAUTH_AUTHORIZE_ENDPOINT: process.env.DISCORD_OAUTH_AUTHORIZE_ENDPOINT
};

export default config;
