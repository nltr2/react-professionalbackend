"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvironment = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const loadEnvironment = (environment) => {
    dotenv_1.default.config({
        path: path_1.default.resolve(`${process.cwd()}\\environments\\${environment}.env`)
    });
};
exports.loadEnvironment = loadEnvironment;
//# sourceMappingURL=env-loader.js.map