import * as dotenv from 'dotenv';

dotenv.config();

const getEnv = (name: string): string => {
    if (!process.env[name]) {
        throw new Error('Не найдена переменная окружения ' + name);
    }
    return process.env[name];
};

export const TELEGRAM_BOT_TOKEN = getEnv('BOT_TOKEN');
export const S3_ENDPOINT = getEnv('S3_ENDPOINT');
export const S3_ACCESS_KEY = getEnv('S3_ACCESS_KEY');
export const S3_SECRET_KEY = getEnv('S3_SECRET_KEY');
export const S3_BUCKET_NAME = getEnv('S3_BUCKET_NAME');
