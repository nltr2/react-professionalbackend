"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const env_loader_1 = require("./env-loader");
const DEFAULT_MONGO_SERVER = "localhost";
const DEFAULT_MONGO_PORT = 27017;
const DEFAULT_MONGO_DB = "reacttrainingdb";
const DEVELOPER_ENVIRONMENT = "dev";
const DEFAULT_PORT_NUMBER = 8080;
const DEFAULT_SECRET_KEY = "9886082730";
const DEFAULT_EXPIRY_TIME = "10m";
class Configuration {
    static getConfiguration() {
        const environment = process.env.ENVIRONMENT || DEVELOPER_ENVIRONMENT;
        env_loader_1.loadEnvironment(environment);
        let connectionString = process.env.MONGO_CONNECTION_STRING;
        if (!connectionString) {
            const mongoServer = process.env.MONGO_SERVER || DEFAULT_MONGO_SERVER;
            const mongoPort = process.env.MONGO_PORT || DEFAULT_MONGO_PORT;
            const mongoDbName = process.env.MONGO_DB || DEFAULT_MONGO_DB;
            connectionString = `mongodb://${mongoServer}:${mongoPort}/${mongoDbName}`;
        }
        const portNumber = parseInt(process.env.LISTENER_PORT || "") || DEFAULT_PORT_NUMBER;
        const enableHttps = (process.env.ENABLE_HTTPS || "") === "true";
        const certFile = process.env.CERT_FILE;
        const keyFile = process.env.KEY_FILE;
        const passphrase = process.env.PASS_PHRASE || "";
        const secretKey = process.env.SECRET_KEY || DEFAULT_SECRET_KEY;
        const expiryTime = process.env.EXPIRY_TIME || DEFAULT_EXPIRY_TIME;
        const settings = {
            getConnectionString: () => connectionString,
            environment,
            certificateDetails: {
                certFile,
                keyFile,
                passphrase
            },
            portNumber,
            enableHttps,
            secretKey,
            expiryTime
        };
        return settings;
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map