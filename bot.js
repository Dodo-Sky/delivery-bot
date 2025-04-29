"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var conversations_1 = require("@grammyjs/conversations");
var auto_retry_1 = require("@grammyjs/auto-retry");
var middleware_1 = require("./middleware/middleware");
var orderProblem_1 = require("./conversation/orderProblem/orderProblem");
var testOrder_1 = require("./conversation/testOrder/testOrder");
var listCommands_1 = require("./commands/listCommands");
var handlers_1 = require("./commands/handlers");
var config_1 = require("./config");
var bot = new grammy_1.Bot(config_1.TELEGRAM_BOT_TOKEN);
bot.api.config.use((0, auto_retry_1.autoRetry)({
    rethrowInternalServerErrors: true, // не обрабатывать внутренние ошибки сервера
}));
bot.use((0, conversations_1.conversations)());
// установить завершение диалогов через 30 минут
var oneHourInMilliseconds = 30 * 60 * 1000;
// установка диалогов в настройки бота
bot.use((0, conversations_1.createConversation)(orderProblem_1.responce, { maxMillisecondsToWait: oneHourInMilliseconds }));
bot.use((0, conversations_1.createConversation)(testOrder_1.testOrder, { maxMillisecondsToWait: oneHourInMilliseconds }));
// запуск обработчиков по программам
bot.on('callback_query:data', middleware_1.responceCourier);
// запуск команд
(0, listCommands_1.getLisCommands)(bot);
bot.command('qrcode', function (ctx) { return (0, handlers_1.qrcode)(ctx); });
bot.command('payment', function (ctx) { return (0, handlers_1.payment)(ctx); });
bot.command('my_orders', function (ctx) { return (0, handlers_1.my_orders)(ctx); });
// bot.command('problem_orders', (ctx) => problem_orders(ctx));
bot.command('faq', function (ctx) { return ctx.reply((0, handlers_1.faq)(), { parse_mode: 'Markdown' }); });
bot.command('start', function (ctx) { return ctx.reply((0, handlers_1.start)()); });
bot.command('test', function (ctx) { return ctx.conversation.enter('testOrder'); });
bot.catch(function (err) {
    var ctx = err.ctx;
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F ".concat(ctx.update.update_id, ":"));
    var e = err.error;
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
