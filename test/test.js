import WHMCSHandler from '../src/whmcs/service.js'

const whmcs = new WHMCSHandler()
whmcs.getProducts(6).then((products) => {
  console.log(products)
})