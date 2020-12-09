import { UserProfile } from "../../../models";

interface IUserProfileService {
    getUserProfiles(): Promise<UserProfile[] | null>;
    getUserProfile(userProfileId: string): Promise<UserProfile | null>;
}

export {
    IUserProfileService
};
