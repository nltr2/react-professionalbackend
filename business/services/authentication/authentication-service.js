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
exports.AuthenticationService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
const INVALID_USER_PROFILE_SERVICE = "Invalid User Profile Service Specified!";
const INVALID_CREDENTIALS = "Invalid Credential(s) Specified!";
const INVALID_SECRET_KEY = "Invalid Secret Key Specified!";
class AuthenticationService {
    constructor(userProfileService) {
        this.userProfileService = userProfileService;
        if (userProfileService === null) {
            throw new Error(INVALID_USER_PROFILE_SERVICE);
        }
    }
    authenticate(userProfileId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const validation = userProfileId !== null && password !== null;
            if (!validation)
                throw new Error(INVALID_CREDENTIALS);
            const userProfile = yield this.userProfileService.getUserProfile(userProfileId);
            if (userProfile === null)
                throw new Error(INVALID_CREDENTIALS);
            const authenticationStatus = userProfile.userProfileId === userProfileId &&
                userProfile.password === password;
            return authenticationStatus;
        });
    }
    generateToken(userProfile) {
        const validation = userProfile !== null &&
            userProfile.userProfileId !== null;
        if (!validation) {
            throw new Error(INVALID_CREDENTIALS);
        }
        const settings = config_1.Configuration.getConfiguration();
        const secretKey = settings === null || settings === void 0 ? void 0 : settings.secretKey;
        const expiryTime = settings === null || settings === void 0 ? void 0 : settings.expiryTime;
        if (secretKey === null) {
            throw new Error(INVALID_SECRET_KEY);
        }
        const safeUserProfile = {
            userProfileId: userProfile.userProfileId,
            email: userProfile.email,
            department: userProfile.department,
            title: userProfile.title
        };
        const token = jsonwebtoken_1.default.sign(safeUserProfile, secretKey, {
            expiresIn: expiryTime
        });
        return token;
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication-service.js.map