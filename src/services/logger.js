import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const customLevelsOptions = {
  levels: { fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5 },
  colors: {
    fatal: "black",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

let logger;

if (process.env.WINSTON_ENV === "devLogger") {
  logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelsOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else if (process.env.WINSTON_ENV === "prodLogger") {
  logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelsOptions.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "src/error.log",
        level: "error",
        format: winston.format.combine(
          winston.format.timestamp(), // Agrega timestamp al log
          winston.format.prettyPrint() // Pretty print para un formato más legible
        ), 
      }),
    ],
  });
}

export default logger;
