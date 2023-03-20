import WHMCSRequest from "./whmcs.js";

export default class WHMCSHandler {
  async getProducts(clientid) {
    const whmcs = new WHMCSRequest();
    const params = {
      action: "GetClientsProducts",
      clientid: clientid,
    };

    return await Promise.resolve(whmcs.request(params)).then((res) => {
      return res;
    });
  }
}
