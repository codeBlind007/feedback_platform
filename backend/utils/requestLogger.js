import logger from "./logger.js";

const requestLogger = (req, res, next) => {
    logger.info("Incoming Request", {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    next();
};

export default requestLogger;