"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectUrl = getObjectUrl;
exports.uploadTelegramFileToStorage = uploadTelegramFileToStorage;
var Minio = require("minio");
var config_1 = require("../config");
var fs = require("fs");
var path = require("path");
var promises_1 = require("stream/promises");
var stream_1 = require("stream");
// Настройка клиента MinIO
var minioClient = new Minio.Client({
    endPoint: config_1.S3_ENDPOINT,
    accessKey: config_1.S3_ACCESS_KEY,
    secretKey: config_1.S3_SECRET_KEY,
});
// Путь до папки с временными файлами
var TMP_DIR = path.join(__dirname, '../tmp');
/**
 * Создает директорию tmp (временное хранилище).
 * Если директория уже существует, она не будет перезаписана.
 */
function ensureTempDir() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.mkdir(TMP_DIR, { recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Сохраняет ReadableStream в файловую систему.
 * Конвертирует поток из fetch в поток Node.js и сохраняет его в файл.
 */
function saveStreamToFile(stream, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var nodeStream, fileStream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nodeStream = stream_1.Readable.fromWeb(stream);
                    fileStream = fs.createWriteStream(filePath);
                    return [4 /*yield*/, (0, promises_1.pipeline)(nodeStream, fileStream)];
                case 1:
                    _a.sent(); // Передаем данные в файл
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Загружает локальный файл в хранилище MinIO.
 * Возвращает информацию о загруженном объекте.
 */
function uploadFile(fileName, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, minioClient.fPutObject(config_1.S3_BUCKET_NAME, fileName, filePath)];
                case 1: return [2 /*return*/, _a.sent()]; // Загружаем файл в MinIO
            }
        });
    });
}
/**
 * Получает публичный или подписанный URL для объекта в хранилище.
 * Если бакет публичный, возвращается прямой URL.
 * Если бакет приватный, генерируется подписанный URL.
 */
function getObjectUrl(objectName_1) {
    return __awaiter(this, arguments, void 0, function (objectName, isPublicBucket) {
        if (isPublicBucket === void 0) { isPublicBucket = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isPublicBucket) {
                        return [2 /*return*/, "https://".concat(config_1.S3_ENDPOINT, "/").concat(config_1.S3_BUCKET_NAME, "/").concat(encodeURIComponent(objectName))]; // Прямой URL для публичного бакета
                    }
                    return [4 /*yield*/, minioClient.presignedGetObject(config_1.S3_BUCKET_NAME, objectName)];
                case 1: return [2 /*return*/, _a.sent()]; // Подписанный URL для приватного бакета
            }
        });
    });
}
// Основная логика
/**
 * Получает файл из Telegram и загружает его в хранилище.
 * Возвращает URL объекта в хранилище.
 */
function uploadTelegramFileToStorage(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var uniqueId, fileName, fileUrl, response, tempFilePath, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2);
                    fileName = "dt/".concat(uniqueId, ".jpg");
                    fileUrl = "https://api.telegram.org/file/bot".concat(config_1.TELEGRAM_BOT_TOKEN, "/").concat(filePath);
                    return [4 /*yield*/, fetch(fileUrl)];
                case 1:
                    response = _a.sent();
                    // Если запрос не удался, выбрасываем ошибку
                    if (!response.ok) {
                        throw new Error("Failed to fetch file from Telegram: ".concat(response.status, " ").concat(response.statusText));
                    }
                    return [4 /*yield*/, ensureTempDir()];
                case 2:
                    _a.sent(); // Убедиться, что временная директория существует
                    tempFilePath = path.join(TMP_DIR, "".concat(uniqueId, ".jpg"));
                    // Сохраняем файл на диск
                    return [4 /*yield*/, saveStreamToFile(response.body, tempFilePath)];
                case 3:
                    // Сохраняем файл на диск
                    _a.sent();
                    // Загружаем файл в MinIO
                    return [4 /*yield*/, uploadFile(fileName, tempFilePath)];
                case 4:
                    // Загружаем файл в MinIO
                    _a.sent();
                    return [4 /*yield*/, getObjectUrl(fileName)];
                case 5:
                    url = _a.sent();
                    // Удаляем временный файл
                    return [4 /*yield*/, fs.promises.unlink(tempFilePath)];
                case 6:
                    // Удаляем временный файл
                    _a.sent();
                    return [2 /*return*/, url]; // Возвращаем URL объекта
            }
        });
    });
}
