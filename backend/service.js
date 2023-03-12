import RequestBuilder from './request.js'

import {WHMCS_USERNAME} from '../index.js'
import {WHMCS_PASSWORD} from '../index.js'

getServices(6)

function getServices(clientId) {

    const builder = new RequestBuilder()
        .addRequestParameter('action', 'GetClientsProducts')
        .addRequestParameter('username', WHMCS_USERNAME)
        .addRequestParameter('password', WHMCS_PASSWORD)
        .addRequestParameter('clientid', clientId)
        .addRequestParameter('responsetype', 'json')

    const request = builder.build()

    return request.createRequest()
}