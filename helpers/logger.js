const { createLogger, transports, config, format } = require("winston");
const { combine, timestamp, json } = format;

const createCustomLogger = (filename) => {
  return createLogger({
    levels: config.syslog.levels,
    format: combine(
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      json(),
    ),
    transports: [
      new transports.File({
        filename: `logs/${filename}.log`,
        maxsize: 100000000,
      }),
    ],
  });
};

module.exports.activityLogger = createCustomLogger("activity");
module.exports.errorLogger = createCustomLogger("error");
