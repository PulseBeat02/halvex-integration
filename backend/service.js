import WHMCSRequest from './whmcs.js'

import {WHMCS_ACCESS_KEY} from '../index.js'

getServices(6)

function getServices(clientId) {

    const request = new WHMCSRequest()
    const promise = request.request('GetClientsProducts', 'GET', {
        clientId: clientId,
        responseType: 'json',
        accessKey: WHMCS_ACCESS_KEY
    })

    return promise.then((response) => {
        return response
    })
}

