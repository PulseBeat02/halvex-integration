import fetch from 'node-fetch'
import config from '../config.js'

const url = `https://discord.com/api/v10/applications/${config.DISCORD_CLIENT_ID}/role-connections/metadata`
const halvex = [
    {
        key: 'services',
        name: 'Halvex Service',
        description: 'Services Greater Than 0',
        type: 2,
    }
]

startServer()

async function startServer() {

    const method = 'PUT'
    const body = JSON.stringify(halvex)
    const header = createHeader()

    const response = await fetch(url, {
        method: method,
        body: body,
        headers: header,
    })

    console.log(response.ok ? await response.json() : await response.text())
}

function createHeader() {
    const content = 'application/json'
    const auth = `Bot ${config.DISCORD_TOKEN}`
    return {
        'Content-Type': content,
        Authorization: auth,
    }
}
