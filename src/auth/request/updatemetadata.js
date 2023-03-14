import Request from './request.js';

export default class UpdateMetaDataRequest extends Request {

    constructor(req, res) {
        super(req, res);
    }

    async handleRequest() {
        try {
            const userId = this.req.body.userId;
            await this.updateMetadata(userId)
            this.res.sendStatus(204);
        } catch (e) {
            this.res.sendStatus(500);
        }
    }
}