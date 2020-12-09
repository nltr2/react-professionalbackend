"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvironment = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const common_1 = require("../common");
const loadEnvironment = (environment) => {
    common_1.LogManager.info("Loading the Configuration File ... and Adding to the Environment ...");
    const fileName = path_1.default.resolve(`${process.cwd()}/environments/${environment}.env`);
    common_1.LogManager.info("Configuration File ... " + fileName);
    dotenv_1.default.config({
        path: fileName
    });
};
exports.loadEnvironment = loadEnvironment;
//# sourceMappingURL=env-loader.js.map