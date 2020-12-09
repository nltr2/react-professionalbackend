"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationRouting = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../business/services");
const constants_1 = require("../constants");
const common_1 = require("../common");
const INVALID_CREDENTIALS = "Invalid Credential(s) Specified!";
const AUTHENTICATION_FAILURE = "Authentication Failed!";
const UNKNOWN_ERROR = "Unknown Error, Please try again later!";
class AuthenticationRouting {
    constructor() {
        this.router = express_1.default.Router();
        this.userProfileService = new services_1.UserProfileService();
        this.authenticationService = new services_1.AuthenticationService(this.userProfileService);
        this.initializeRouting();
    }
    initializeRouting() {
        this.router.post("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const userProfileId = body.userProfileId;
            const password = body.password;
            const validation = userProfileId !== null && password !== null;
            if (!validation) {
                response
                    .status(constants_1.HttpStatusCodes.BAD_REQUEST)
                    .send({
                    message: INVALID_CREDENTIALS
                });
                return;
            }
            try {
                const authenticationStatus = yield this.authenticationService.authenticate(userProfileId, password);
                if (!authenticationStatus) {
                    response
                        .status(constants_1.HttpStatusCodes.UNAUTHORIZED)
                        .send({
                        message: AUTHENTICATION_FAILURE
                    });
                    return;
                }
                const userProfile = yield this.userProfileService.getUserProfile(userProfileId);
                if (userProfile === null) {
                    response
                        .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                        .send({
                        message: UNKNOWN_ERROR
                    });
                    return;
                }
                const token = this.authenticationService.generateToken(userProfile);
                response
                    .status(constants_1.HttpStatusCodes.OK)
                    .send({
                    token
                });
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        }));
    }
    get Router() {
        return this.router;
    }
    ;
}
exports.AuthenticationRouting = AuthenticationRouting;
//# sourceMappingURL=authentication-routing.js.map