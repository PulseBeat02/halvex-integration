const WHCS_USERNAME = require('./../credentials.json');
const WHCS_PASSWORD = require('./../credentials.json');

function getServices(clientId) {

    const builder = new RequestBuilder()
        .addRequestParameter('action', 'GetClientsProducts')
        .addRequestParameter('username', WHCS_USERNAME)
        .addRequestParameter('password', WHCS_PASSWORD)
        .addRequestParameter('clientid', clientId)
        .addRequestParameter('responsetype', 'json');

    const request = new WHMCSRequest(builder.build())
    return request.createRequest()
}