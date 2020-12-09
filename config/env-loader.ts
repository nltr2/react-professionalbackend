import path from 'path';
import dotenv from "dotenv";
import { LogManager } from '../common';

const loadEnvironment = (environment: string) => {
    LogManager.info("Loading the Configuration File ... and Adding to the Environment ...");

    const fileName = `${process.cwd()}/environments/${environment}.env`;

    LogManager.info("Configuration File ... " + fileName);

    dotenv.config({
        path: path.resolve(`${process.cwd()}/environments/${environment}.env`)
    });
};

export {
    loadEnvironment
};
