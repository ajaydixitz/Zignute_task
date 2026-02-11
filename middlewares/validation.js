const utils = require('../helpers/utils')
const { responseStatus } = require('../helpers/appConstants')

module.exports.validator = (schema) => async (req, res, next) => {

    console.log("::::::::::::::::::::::validator::::::", req.body, req.url);

    const OBJECT = Object.assign({});
    OBJECT.BODY = req.body;
    OBJECT.METHOD = req.method;
    OBJECT.PATH = req.originalUrl;
    OBJECT.PARAMS = req.params;
    OBJECT.QUERY = req.query;
    OBJECT.HEADERS = req.headers;
    try {

        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        return res.status(responseStatus.badRequest).send(utils.createErrorResponse(req, err?.message));
    }
}