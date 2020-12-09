import { LogManager } from "./common";
import { CertificateDetails, Customer } from "./models";
import { Configuration } from "./config";
import { CustomerService } from "./business/services/customers";
import { CustomerServiceHost, IServiceHost } from "./hosting";

const INVALID_SSL_CERTIFICATE_DETAILS = "Invalid SSL Certificate Env. Details Specified!";

class MainClass {
    static main(): void {
        try {
            const configuration = Configuration.getConfiguration();
            const enableHttps = configuration.enableHttps;
            const portNumber = configuration.portNumber;

            let host: IServiceHost;

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
                const certificateDetails = new CertificateDetails(keyFile, certFile, passphrase);

                host = new CustomerServiceHost(portNumber, enableHttps, certificateDetails);
            } else {
                host = new CustomerServiceHost(portNumber, enableHttps);
            }

            host.start()
                .then(() => LogManager.info("Customer Service Host Started Successfully!"),
                    () => LogManager.error("Unable to Start the Customer Service Host!"));

            const shutdown = () => {
                host.stop()
                    .then(
                        () => LogManager.info("Customer Service Host Stopped Successfully!"),
                        () => LogManager.error("Unable to Stop the Customer Service Host"!));
            };

            process.on('exit', shutdown);
            process.on('SIGINT', shutdown);
        } catch (error) {
            LogManager.error(error);
        }
    }
}

MainClass.main();