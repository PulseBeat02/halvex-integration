import fetch from "node-fetch";
import config from "../config.js";

const url = `https://discord.com/api/v10/applications/${config.DISCORD_CLIENT_ID}/role-connections/metadata`;
const halvex = [
  {
    key: "halvexservices",
    name: "Halvex Services",
    description: "Halvex Services Greater Than",
    type: 2,
  },
];

export default async function createRequest() {
  const method = "PUT";
  await fetch(url, {
    method: method,
    body: JSON.stringify(halvex),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${config.DISCORD_TOKEN}`,
    },
  });
}
