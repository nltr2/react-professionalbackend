import { IUserProfileService } from "./iuser-profile-service";
import { UserProfile } from "../../../models";

const INVALID_CUSTOMER_PROFILE = "Invalid Customer Profile | Profile Not Found!";

class UserProfileService implements IUserProfileService {
    private userProfiles: UserProfile[];

    constructor() {
        this.userProfiles =
            [
                new UserProfile("USRPRF00011", "Prestige", "info@email.com", "Executive", "IT"),
                new UserProfile("USRPRF00012", "Prestige", "info@email.com", "Executive", "IT"),
                new UserProfile("USRPRF00013", "Prestige", "info@email.com", "Executive", "IT"),
                new UserProfile("USRPRF00014", "Prestige", "info@email.com", "Executive", "IT"),
                new UserProfile("USRPRF00015", "Prestige", "info@email.com", "Executive", "IT")
            ];
    }

    getUserProfiles(): Promise<UserProfile[] | null> {
        const promise = new Promise<UserProfile[] | null>(
            (resolve, reject) => {
                resolve(this.userProfiles);
            });

        return promise;
    }

    getUserProfile(userProfileId: string): Promise<UserProfile | null> {
        const promise = new Promise<UserProfile | null>(
            (resolve, reject) => {
                let filteredUserProfile: UserProfile | null = null;

                for (const profile of this.userProfiles) {
                    if (profile.userProfileId === userProfileId) {
                        filteredUserProfile = profile;
                        break;
                    }
                }

                if (filteredUserProfile !== null) {
                    resolve(filteredUserProfile);
                } else { reject(INVALID_CUSTOMER_PROFILE); }
            });

        return promise;
    }
}

export {
    UserProfileService
};
