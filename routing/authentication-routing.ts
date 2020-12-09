import express from 'express';
import { IRouting } from "./icustomer-routing";
import { IUserProfileService, IAuthenticationService, UserProfileService, AuthenticationService } from '../business/services';
import { HttpStatusCodes } from '../constants';
import { LogManager } from '../common';

const INVALID_CREDENTIALS = "Invalid Credential(s) Specified!";
const AUTHENTICATION_FAILURE = "Authentication Failed!";
const UNKNOWN_ERROR = "Unknown Error, Please try again later!";

class AuthenticationRouting implements IRouting {
    private router: express.Router;
    private userProfileService: IUserProfileService;
    private authenticationService: IAuthenticationService

    constructor() {
        this.router = express.Router();
        this.userProfileService = new UserProfileService();
        this.authenticationService = new AuthenticationService(this.userProfileService);

        this.initializeRouting();
    }

    private initializeRouting() {
        this.router.post("/", async (request, response) => {
            const body = request.body;
            const userProfileId = body.userProfileId;
            const password = body.password;
            const validation = userProfileId !== null && password !== null;

            if (!validation) {
                response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .send({
                        message: INVALID_CREDENTIALS
                    });

                return;
            }

            try {
                const authenticationStatus = await this.authenticationService.authenticate(
                    userProfileId, password);

                if (!authenticationStatus) {
                    response
                        .status(HttpStatusCodes.UNAUTHORIZED)
                        .send({
                            message: AUTHENTICATION_FAILURE
                        });

                    return;
                }

                const userProfile = await this.userProfileService.getUserProfile(userProfileId);

                if (userProfile === null) {
                    response
                        .status(HttpStatusCodes.SERVER_ERROR)
                        .send({
                            message: UNKNOWN_ERROR
                        });

                    return;
                }

                const token = this.authenticationService.generateToken(userProfile);

                response
                    .status(HttpStatusCodes.OK)
                    .send({
                        token
                    });
            } catch (exception) {
                LogManager.error(exception);

                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        });
    }

    public get Router() {
        return this.router;
    };
}

export {
    AuthenticationRouting
};
