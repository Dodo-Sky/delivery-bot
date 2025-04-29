# Delivery Bot

Telegram-бот для обработки проблем с доставкой, написанный на TypeScript. Сборка осуществляется с помощью `tsup`, переменные окружения управляются через `.env`.

---

В корне проекта создайте файл .env и заполните его следующими переменными:

```ini
BOT_TOKEN=Ваш-Telegram-токен
S3_ENDPOINT=https://ваш-s3-endpoint
S3_ACCESS_KEY=ваш-access-key
S3_SECRET_KEY=ваш-secret-key
S3_BUCKET_NAME=имя-bucket
```

## Сборка проекта

Для компиляции TypeScript-файлов в один JavaScript-файл используйте:

```bash
npx tsup bot.ts --out-dir=. --minify
```

## Запуск бота

После сборки выполните:

```bash
node bot.js
```

## Разработка

Для режима автосборки при изменениях:

```bash
npx tsup bot.ts --out-dir=. --watch
```
