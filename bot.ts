import { Bot, GrammyError, HttpError, type Context } from 'grammy';
import { type ConversationFlavor, conversations, createConversation } from '@grammyjs/conversations';
import { autoRetry } from '@grammyjs/auto-retry';
import { responceCourier } from "./middleware/middleware";
import { responce } from "./conversation/orderProblem/orderProblem";
import { testOrder } from "./conversation/testOrder/testOrder";
import { getLisCommands } from "./commands/listCommands";
import { qrcode, faq, payment, start, my_orders, mysalary } from "./commands/handlers";
import { TELEGRAM_BOT_TOKEN } from './config';

const bot = new Bot<ConversationFlavor<Context>>(TELEGRAM_BOT_TOKEN);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
bot.api.config.use(
  autoRetry({
    rethrowInternalServerErrors: true, // не обрабатывать внутренние ошибки сервера
  }),
);
bot.use(conversations());
// установить завершение диалогов через 30 минут
const oneHourInMilliseconds = 30 * 60 * 1000;
// установка диалогов в настройки бота
bot.use(createConversation(responce, { maxMillisecondsToWait: oneHourInMilliseconds }));
bot.use(createConversation(testOrder, { maxMillisecondsToWait: oneHourInMilliseconds }));

// запуск обработчиков по программам
bot.on('callback_query:data', responceCourier);

// запуск команд
getLisCommands(bot);
bot.command('qrcode', (ctx) => qrcode(ctx));
bot.command('payment', (ctx) => payment(ctx));
bot.command('my_orders', (ctx) => my_orders(ctx));
bot.command('mysalary', (ctx) => mysalary(ctx));
// bot.command('problem_orders', (ctx) => problem_orders(ctx));
bot.command('faq', (ctx) => ctx.reply(faq(), { parse_mode: 'Markdown' }));
bot.command('start', (ctx) => ctx.reply(start()));
bot.command('test', (ctx) => ctx.conversation.enter('testOrder'));

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Внешняя Ошибка в запросе:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Не удалось связаться с Telegram:', e);
  } else {
    console.error('Неизвестная ошибка:', e);
  }
});

bot.start();
console.log('Бот запущщен');