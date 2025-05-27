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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectUrl = getObjectUrl;
exports.uploadTelegramFileToStorage = uploadTelegramFileToStorage;
const Minio = __importStar(require("minio"));
const config_1 = require("../config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const promises_1 = require("stream/promises");
const stream_1 = require("stream");
// Настройка клиента MinIO
const minioClient = new Minio.Client({
    endPoint: config_1.S3_ENDPOINT,
    accessKey: config_1.S3_ACCESS_KEY,
    secretKey: config_1.S3_SECRET_KEY,
});
// Путь до папки с временными файлами
const TMP_DIR = path.join(__dirname, '../tmp');
/**
 * Создает директорию tmp (временное хранилище).
 * Если директория уже существует, она не будет перезаписана.
 */
function ensureTempDir() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.promises.mkdir(TMP_DIR, { recursive: true });
    });
}
/**
 * Сохраняет ReadableStream в файловую систему.
 * Конвертирует поток из fetch в поток Node.js и сохраняет его в файл.
 */
function saveStreamToFile(stream, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodeStream = stream_1.Readable.fromWeb(stream); // Конвертация потока
        const fileStream = fs.createWriteStream(filePath); // Поток для записи в файл
        yield (0, promises_1.pipeline)(nodeStream, fileStream); // Передаем данные в файл
    });
}
/**
 * Загружает локальный файл в хранилище MinIO.
 * Возвращает информацию о загруженном объекте.
 */
function uploadFile(fileName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield minioClient.fPutObject(config_1.S3_BUCKET_NAME, fileName, filePath); // Загружаем файл в MinIO
    });
}
/**
 * Получает публичный или подписанный URL для объекта в хранилище.
 * Если бакет публичный, возвращается прямой URL.
 * Если бакет приватный, генерируется подписанный URL.
 */
function getObjectUrl(objectName_1) {
    return __awaiter(this, arguments, void 0, function* (objectName, isPublicBucket = true) {
        if (isPublicBucket) {
            return `https://${config_1.S3_ENDPOINT}/${config_1.S3_BUCKET_NAME}/${encodeURIComponent(objectName)}`; // Прямой URL для публичного бакета
        }
        return yield minioClient.presignedGetObject(config_1.S3_BUCKET_NAME, objectName); // Подписанный URL для приватного бакета
    });
}
// Основная логика
/**
 * Получает файл из Telegram и загружает его в хранилище.
 * Возвращает URL объекта в хранилище.
 */
function uploadTelegramFileToStorage(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2); // Генерация уникального идентификатора для файла
        const fileName = `dt/${uniqueId}.jpg`; // Имя файла в хранилище
        const fileUrl = `https://api.telegram.org/file/bot${config_1.TELEGRAM_BOT_TOKEN}/${filePath}`; // URL для скачивания файла из Telegram
        const response = yield fetch(fileUrl); // Получаем файл через fetch
        // Если запрос не удался, выбрасываем ошибку
        if (!response.ok) {
            throw new Error(`Failed to fetch file from Telegram: ${response.status} ${response.statusText}`);
        }
        yield ensureTempDir(); // Убедиться, что временная директория существует
        const tempFilePath = path.join(TMP_DIR, `${uniqueId}.jpg`); // Путь к временному файлу
        // Сохраняем файл на диск
        yield saveStreamToFile(response.body, tempFilePath);
        // Загружаем файл в MinIO
        yield uploadFile(fileName, tempFilePath);
        // Получаем URL для загруженного объекта
        const url = yield getObjectUrl(fileName);
        // Удаляем временный файл
        yield fs.promises.unlink(tempFilePath);
        return url; // Возвращаем URL объекта
    });
}
