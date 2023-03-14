import fetch from 'node-fetch';
import config from '../config.js';

const url = `https://discord.com/api/v10/applications/${config.DISCORD_CLIENT_ID}/role-connections/metadata`;
const body = [
    {
        key: 'services',
        name: 'Halvex Service',
        description: 'Services Greater Than 0',
        type: 2,
    }
];

const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${config.DISCORD_TOKEN}`,
    },
});

if (response.ok) {
    const data = await response.json();
    console.log(data);
} else {
    const data = await response.text();
    console.log(data);
}