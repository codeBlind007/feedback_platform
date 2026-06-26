import logger from "../utils/logger.js";

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(err.message, {
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandler;