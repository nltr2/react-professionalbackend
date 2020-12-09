"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const models_1 = require("../../../models");
const INVALID_CUSTOMER_PROFILE = "Invalid Customer Profile | Profile Not Found!";
class UserProfileService {
    constructor() {
        this.userProfiles =
            [
                new models_1.UserProfile("USRPRF00011", "Prestige", "info@email.com", "Executive", "IT"),
                new models_1.UserProfile("USRPRF00012", "Prestige", "info@email.com", "Executive", "IT"),
                new models_1.UserProfile("USRPRF00013", "Prestige", "info@email.com", "Executive", "IT"),
                new models_1.UserProfile("USRPRF00014", "Prestige", "info@email.com", "Executive", "IT"),
                new models_1.UserProfile("USRPRF00015", "Prestige", "info@email.com", "Executive", "IT")
            ];
    }
    getUserProfiles() {
        const promise = new Promise((resolve, reject) => {
            resolve(this.userProfiles);
        });
        return promise;
    }
    getUserProfile(userProfileId) {
        const promise = new Promise((resolve, reject) => {
            let filteredUserProfile = null;
            for (const profile of this.userProfiles) {
                if (profile.userProfileId === userProfileId) {
                    filteredUserProfile = profile;
                    break;
                }
            }
            if (filteredUserProfile !== null) {
                resolve(filteredUserProfile);
            }
            else {
                reject(INVALID_CUSTOMER_PROFILE);
            }
        });
        return promise;
    }
}
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=user-profile-service.js.map