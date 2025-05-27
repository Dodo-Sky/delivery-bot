"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
const auto_retry_1 = require("@grammyjs/auto-retry");
const middleware_1 = require("./middleware/middleware");
const orderProblem_1 = require("./conversation/orderProblem/orderProblem");
const testOrder_1 = require("./conversation/testOrder/testOrder");
const listCommands_1 = require("./commands/listCommands");
const handlers_1 = require("./commands/handlers");
const config_1 = require("./config");
const bot = new grammy_1.Bot(config_1.TELEGRAM_BOT_TOKEN);
bot.api.config.use((0, auto_retry_1.autoRetry)({
    rethrowInternalServerErrors: true, // не обрабатывать внутренние ошибки сервера
}));
bot.use((0, conversations_1.conversations)());
// установить завершение диалогов через 30 минут
const oneHourInMilliseconds = 30 * 60 * 1000;
// установка диалогов в настройки бота
bot.use((0, conversations_1.createConversation)(orderProblem_1.responce, { maxMillisecondsToWait: oneHourInMilliseconds }));
bot.use((0, conversations_1.createConversation)(testOrder_1.testOrder, { maxMillisecondsToWait: oneHourInMilliseconds }));
// запуск обработчиков по программам
bot.on('callback_query:data', middleware_1.responceCourier);
// запуск команд
(0, listCommands_1.getLisCommands)(bot);
bot.command('qrcode', (ctx) => (0, handlers_1.qrcode)(ctx));
bot.command('payment', (ctx) => (0, handlers_1.payment)(ctx));
bot.command('my_orders', (ctx) => (0, handlers_1.my_orders)(ctx));
bot.command('mysalary', (ctx) => (0, handlers_1.mysalary)(ctx));
bot.command('problem_orders', (ctx) => (0, handlers_1.problem_orders)(ctx));
bot.command('faq', (ctx) => ctx.reply((0, handlers_1.faq)(), { parse_mode: 'Markdown' }));
bot.command('start', (ctx) => ctx.reply((0, handlers_1.start)()));
bot.command('test', (ctx) => ctx.conversation.enter('testOrder'));
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error('Внешняя Ошибка в запросе:', e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error('Не удалось связаться с Telegram:', e);
    }
    else {
        console.error('Неизвестная ошибка:', e);
    }
});
bot.start();
console.log('Бот запущщен');
