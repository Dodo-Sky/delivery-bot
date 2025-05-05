import * as Minio from 'minio';
import { S3_ACCESS_KEY, S3_BUCKET_NAME, S3_ENDPOINT, S3_SECRET_KEY, TELEGRAM_BOT_TOKEN } from '../config';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { UploadedObjectInfo } from 'minio/dist/main/internal/type';

// Настройка клиента MinIO
const minioClient = new Minio.Client({
  endPoint: S3_ENDPOINT,
  accessKey: S3_ACCESS_KEY,
  secretKey: S3_SECRET_KEY,
});

// Путь до папки с временными файлами
const TMP_DIR = path.join(__dirname, '../tmp');

/**
 * Создает директорию tmp (временное хранилище).
 * Если директория уже существует, она не будет перезаписана.
 */
async function ensureTempDir(): Promise<void> {
  await fs.promises.mkdir(TMP_DIR, { recursive: true });
}

/**
 * Сохраняет ReadableStream в файловую систему.
 * Конвертирует поток из fetch в поток Node.js и сохраняет его в файл.
 */
async function saveStreamToFile(stream: ReadableStream<Uint8Array>, filePath: string): Promise<void> {
  const nodeStream = Readable.fromWeb(stream as any); // Конвертация потока
  const fileStream = fs.createWriteStream(filePath); // Поток для записи в файл
  await pipeline(nodeStream, fileStream); // Передаем данные в файл
}

/**
 * Загружает локальный файл в хранилище MinIO.
 * Возвращает информацию о загруженном объекте.
 */
async function uploadFile(fileName: string, filePath: string): Promise<UploadedObjectInfo> {
  return await minioClient.fPutObject(S3_BUCKET_NAME, fileName, filePath); // Загружаем файл в MinIO
}

/**
 * Получает публичный или подписанный URL для объекта в хранилище.
 * Если бакет публичный, возвращается прямой URL.
 * Если бакет приватный, генерируется подписанный URL.
 */
export async function getObjectUrl(objectName: string, isPublicBucket = true): Promise<string> {
  if (isPublicBucket) {
    return `https://${S3_ENDPOINT}/${S3_BUCKET_NAME}/${encodeURIComponent(objectName)}`; // Прямой URL для публичного бакета
  }
  return await minioClient.presignedGetObject(S3_BUCKET_NAME, objectName); // Подписанный URL для приватного бакета
}

// Основная логика
/**
 * Получает файл из Telegram и загружает его в хранилище.
 * Возвращает URL объекта в хранилище.
 */
export async function uploadTelegramFileToStorage(filePath: string): Promise<string> {
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2); // Генерация уникального идентификатора для файла
  const fileName = `dt/${uniqueId}.jpg`; // Имя файла в хранилище
  const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`; // URL для скачивания файла из Telegram

  const response = await fetch(fileUrl); // Получаем файл через fetch

  // Если запрос не удался, выбрасываем ошибку
  if (!response.ok) {
    throw new Error(`Failed to fetch file from Telegram: ${response.status} ${response.statusText}`);
  }

  await ensureTempDir(); // Убедиться, что временная директория существует
  const tempFilePath = path.join(TMP_DIR, `${uniqueId}.jpg`); // Путь к временному файлу

  // Сохраняем файл на диск
  await saveStreamToFile(response.body!, tempFilePath);

  // Загружаем файл в MinIO
  await uploadFile(fileName, tempFilePath);

  // Получаем URL для загруженного объекта
  const url = await getObjectUrl(fileName);

  // Удаляем временный файл
  await fs.promises.unlink(tempFilePath);

  return url; // Возвращаем URL объекта
}
