import express from 'express'
import cookieParser from 'cookie-parser'
import LinkedRoleRequest from './request/linkedrole.js'
import UpdateMetaDataRequest from './request/updatemetadata.js'
import OAuthCallbackRequest from './request/oauth.js'

import config from '../config.js'

const app = express()
app.use(cookieParser(config.COOKIE_SECRET))

app.get('/linked-role', async (req, res) => {
    const request = new LinkedRoleRequest(req, res)
    request.handleRequest()
})

app.get('/discord-oauth-callback', async (req, res) => {
    const request = new OAuthCallbackRequest(req, res)
    await request.handleRequest()
})

app.post('/update-metadata', async (req, res) => {
    const request = new UpdateMetaDataRequest(req, res)
    await request.handleRequest()
})
app.listen(config.DISCORD_PORT, () => {
    console.log(`Express app listening on ${config.DISCORD_PORT}`)
})


