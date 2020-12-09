import jwt from 'jsonwebtoken';
import { IAuthenticationService } from "./iauthentication-service";
import { IUserProfileService } from "../userprofiles";
import { UserProfile } from "../../../models";
import { Configuration } from "../../../config";

const INVALID_USER_PROFILE_SERVICE = "Invalid User Profile Service Specified!";
const INVALID_CREDENTIALS = "Invalid Credential(s) Specified!";
const INVALID_SECRET_KEY = "Invalid Secret Key Specified!";

class AuthenticationService implements IAuthenticationService {
    constructor(private userProfileService: IUserProfileService) {
        if (userProfileService === null) {
            throw new Error(INVALID_USER_PROFILE_SERVICE);
        }
    }

    async authenticate(userProfileId: string, password: string): Promise<boolean> {
        const validation = userProfileId !== null && password !== null;

        if (!validation)
            throw new Error(INVALID_CREDENTIALS);

        const userProfile = await this.userProfileService.getUserProfile(userProfileId);

        if (userProfile === null)
            throw new Error(INVALID_CREDENTIALS);

        const authenticationStatus = userProfile.userProfileId === userProfileId &&
            userProfile.password === password;

        return authenticationStatus;
    }

    generateToken(userProfile: UserProfile): string {
        const validation = userProfile !== null &&
            userProfile.userProfileId !== null;

        if (!validation) {
            throw new Error(INVALID_CREDENTIALS);
        }

        const settings = Configuration.getConfiguration();
        const secretKey = settings?.secretKey;
        const expiryTime = settings?.expiryTime;

        if (secretKey === null) {
            throw new Error(INVALID_SECRET_KEY);
        }

        const safeUserProfile = {
            userProfileId: userProfile.userProfileId,
            email: userProfile.email,
            department: userProfile.department,
            title: userProfile.title
        };

        const token = jwt.sign(safeUserProfile, secretKey, {
            expiresIn: expiryTime
        });

        return token;
    }
}

export {
    AuthenticationService
};
