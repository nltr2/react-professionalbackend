"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const utilities_1 = require("../utilities");
class UserProfile {
    constructor(userProfileId, password, email, title, department) {
        this.userProfileId = userProfileId;
        this.password = password;
        this.email = email;
        this.title = title;
        this.department = department;
    }
    toString() {
        return utilities_1.ObjectFormatter.format(this);
    }
}
exports.UserProfile = UserProfile;
//# sourceMappingURL=user-profile.js.map