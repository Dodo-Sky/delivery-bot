"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET_NAME = exports.S3_SECRET_KEY = exports.S3_ACCESS_KEY = exports.S3_ENDPOINT = exports.TELEGRAM_BOT_TOKEN = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getEnv = (name) => {
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
