"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET_NAME = exports.S3_SECRET_KEY = exports.S3_ACCESS_KEY = exports.S3_ENDPOINT = exports.TELEGRAM_BOT_TOKEN = void 0;
var dotenv = require("dotenv");
dotenv.config();
var getEnv = function (name) {
    if (!process.env[name]) {
        throw new Error('Не найдена переменная окружения ' + name);
    }
    return process.env[name];
};
exports.TELEGRAM_BOT_TOKEN = getEnv('BOT_TOKEN');
exports.S3_ENDPOINT = getEnv('S3_ENDPOINT');
exports.S3_ACCESS_KEY = getEnv('S3_ACCESS_KEY');
exports.S3_SECRET_KEY = getEnv('S3_SECRET_KEY');
exports.S3_BUCKET_NAME = getEnv('S3_BUCKET_NAME');
