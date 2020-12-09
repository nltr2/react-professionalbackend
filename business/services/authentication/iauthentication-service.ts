import { UserProfile } from "../../../models";

interface IAuthenticationService {
    authenticate(userProfileId: string, password: string): Promise<boolean>;
    generateToken(userProfile: UserProfile): string;
}

export {
    IAuthenticationService
};
