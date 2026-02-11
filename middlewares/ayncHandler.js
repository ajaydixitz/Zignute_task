const fs = require('fs')

const asyncTryCatchMiddleware = (handler) => {
    return async (req, res, next) => {
        const OBJECT = Object.assign({});
        OBJECT.BODY = req.body;
        OBJECT.METHOD = req.method;
        OBJECT.PATH = req.originalUrl;
        OBJECT.PARAMS = req.params;
        OBJECT.QUERY = req.query;
        OBJECT.HEADERS = req.headers;
        OBJECT.DATE = new Date();
        const LINE = '----------------------------------------'
        fs.appendFileSync('requestLogs.txt', `${JSON.stringify(OBJECT)}\n${LINE}\n\n`);

        // console.log(":::::::::::::;under controller>>>>>>>>::::::::::;", req.body)

        try { await handler(req, res) }
        catch (err) {
            console.error("caught inside error", err)
            next(err)
        }
    }
}

module.exports = { asyncTryCatchMiddleware }