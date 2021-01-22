const Log = require('../models/log');

const guardarLog = (req, Data, respuesta, status = 200) => {

    try {

        const log = new Log({
            baseUrl: req.baseUrl,
            method: req.method,
            ip: req.connection.remoteAddress,
            Data,
            respuesta,
            status,
            uid: req.uid
        });

        log.save();

    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    guardarLog
}