import WHMCSRequest from './whmcs.js'

console.log(getProducts(1))

async function getProducts(clientid) {

    const whmcs = new WHMCSRequest()
    const params = {
        action: 'GetClientsProducts',
        clientid: clientid,
    }

    const json = await whmcs.request(params)

    console.log(json)

    return json
}