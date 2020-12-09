import path from 'path';
import dotenv from "dotenv";

const loadEnvironment = (environment: string) => {
    dotenv.config({
        path: path.resolve(`${process.cwd()}\\environments\\${environment}.env`)
    });
};

export {
    loadEnvironment
};
