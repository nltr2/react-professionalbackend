import http from 'http';
import https from 'https';
import net from 'net';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressJwt from 'express-jwt';
import socketio from 'socket.io';
import { IServiceHost } from './iservice-host';
import { CustomerRouting, IRouting, AuthenticationRouting } from '../routing';
import { CertificateDetails } from '../models';
import { LogManager } from '../common';
import { INotificationService, SocketNotificationService } from '../business/services';
import { RandomGenerator } from '../utilities';
import { HttpStatusCodes } from '../constants';
import { Configuration } from '../config';

const INVALID_CERTIFICATE_DETAILS = "Invalid SSL Certificate Details Provided!";
const CUSTOMERS_API = "/api/customers";
const AUTHENTICATION_API = "/authenticate";
const PUBLIC_ROOT = "/";
const INVALID_SECRET_KEY = "Invalid Secret Key Specified!";

class CustomerServiceHost implements IServiceHost {
    private customerRouting: IRouting;
    private authenticationRouting: IRouting;
    private application: express.Application;
    private webServer: net.Server;
    private socketIOServer: socketio.Server;
    private notificationService: INotificationService

    constructor(private portNumber: number,
        httpsEnabled: boolean,
        certificateDetails?: CertificateDetails | null) {
        this.application = express();

        if (httpsEnabled) {
            const validation = certificateDetails && certificateDetails.keyFile !== null &&
                certificateDetails.certFile !== null &&
                fs.existsSync(certificateDetails.keyFile) &&
                fs.existsSync(certificateDetails.certFile);

            if (!validation) {
                throw new Error(INVALID_CERTIFICATE_DETAILS);
            }

            const keyFile = certificateDetails?.keyFile || "";
            const certFile = certificateDetails?.certFile || "";

            this.webServer = https.createServer({
                key: fs.readFileSync(keyFile),
                cert: fs.readFileSync(certFile),
                passphrase: certificateDetails?.passphrase
            }, this.application);
        } else {
            this.webServer = http.createServer(this.application);
        }

        this.socketIOServer = socketio.listen(<any>this.webServer);
        this.notificationService = new SocketNotificationService(this.socketIOServer);
        this.customerRouting = new CustomerRouting(undefined, this.notificationService);
        this.authenticationRouting = new AuthenticationRouting();

        this.initialize();
    }

    private applyCors(request: express.Request, response: express.Response, next: express.NextFunction) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "*");
        response.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
        response.header("Access-Control-Allow-Credentials", "true");

        next();
    }

    private handleError(error: any, request: express.Request, response: express.Response, next: express.NextFunction) {
        if (error && error.constructor.name === "UnauthorizedError") {
            response.status(HttpStatusCodes.UNAUTHORIZED);

            return;
        }

        next();
    }

    private initialize() {
        if (this.application) {
            const settings = Configuration.getConfiguration();
            const secretKey = settings.secretKey;

            if (secretKey === null) {
                throw new Error(INVALID_SECRET_KEY);
            }

            this.application.use(<any>morgan('dev'));
            this.application.use(this.applyCors);
            this.application.use(this.handleError);
            this.application.use(bodyParser.json());
            this.application.use(CUSTOMERS_API, expressJwt({
                secret: secretKey
            }));
            this.application.use(CUSTOMERS_API, this.customerRouting.Router);
            this.application.use(AUTHENTICATION_API, this.authenticationRouting.Router);
            this.application.use(PUBLIC_ROOT, express.static("public"));

            this.socketIOServer.on("connection",
                socketClient => {
                    let socketClientId = RandomGenerator.generate();

                    socketClient.id = socketClientId.toString();

                    LogManager.info("Connected ... " + socketClient.id);

                    socketClient.on("disconnect", () => {
                        LogManager.info("Disconnected ... " + socketClient.id);
                    });
                });
        }
    }

    public start(): Promise<boolean> {
        const promise = new Promise<boolean>(
            (resolve, reject) => {
                try {
                    if (this.webServer) {
                        this.webServer.listen(this.portNumber, () => {
                            resolve(true);
                        });
                    } else reject(false);
                } catch (exception) {
                    LogManager.error(exception);

                    reject(false);
                }
            });

        return promise;
    }

    public stop(): Promise<boolean> {
        const promise = new Promise<boolean>(
            (resolve, reject) => {
                try {
                    if (this.webServer) {
                        this.webServer.close(() => {
                            resolve(true);
                        });
                    } else reject(false);
                } catch (exception) {
                    LogManager.error(exception);

                    reject(false);
                }
            });

        return promise;
    }
}

export {
    CustomerServiceHost
};
