import cron from 'node-cron'
import WHMCSHandler from './service.js'

export default class TaskJob {
    constructor() {
        this.handler = new WHMCSHandler()
    }

    start() {
        cron.schedule('*/5 * * * *', this::(this.checkServices)())
    }

    checkServices() {
        this.handler.getProducts(6).then((res) => {

            const products = res["products"]


        })
    }

    #checkRole() {

    }
}