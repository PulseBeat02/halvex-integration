import RequestBuilder from './request.js'

import {WHMCS_USERNAME} from '../index.js'
import {WHMCS_PASSWORD} from '../index.js'
import {WHMCS_ACCESS_KEY} from '../index.js'

getServices(6)

function getServices(clientId) {

    const builder = new RequestBuilder()
        .addRequestParameter('action', 'GetClientsProducts')
        .addRequestParameter('username', WHMCS_USERNAME)
        .addRequestParameter('password', WHMCS_PASSWORD)
        .addRequestParameter('clientid', clientId)
        .addRequestParameter('responsetype', 'json')
        .addRequestParameter('accesskey', WHMCS_ACCESS_KEY)

    const request = builder.build()

    return request.createRequest()
}