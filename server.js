"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const models_1 = require("./models");
const config_1 = require("./config");
const hosting_1 = require("./hosting");
const INVALID_SSL_CERTIFICATE_DETAILS = "Invalid SSL Certificate Env. Details Specified!";
class MainClass {
    static main() {
        try {
            const configuration = config_1.Configuration.getConfiguration();
            const enableHttps = configuration.enableHttps;
            const portNumber = configuration.portNumber;
            let host;
            if (enableHttps) {
                const certFile = configuration.certificateDetails.certFile;
                const keyFile = configuration.certificateDetails.keyFile;
                if (!certFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }
                if (!keyFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }
                const passphrase = configuration.certificateDetails.passphrase;
                const certificateDetails = new models_1.CertificateDetails(keyFile, certFile, passphrase);
                host = new hosting_1.CustomerServiceHost(portNumber, enableHttps, certificateDetails);
            }
            else {
                host = new hosting_1.CustomerServiceHost(portNumber, enableHttps);
            }
            host.start()
                .then(() => common_1.LogManager.info("Customer Service Host Started Successfully!"), () => common_1.LogManager.error("Unable to Start the Customer Service Host!"));
            const shutdown = () => {
                host.stop()
                    .then(() => common_1.LogManager.info("Customer Service Host Stopped Successfully!"), () => common_1.LogManager.error("Unable to Stop the Customer Service Host"));
            };
            process.on('exit', shutdown);
            process.on('SIGINT', shutdown);
        }
        catch (error) {
            common_1.LogManager.error(error);
        }
    }
}
MainClass.main();
//# sourceMappingURL=server.js.map