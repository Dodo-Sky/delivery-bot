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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testOrder = testOrder;
const grammy_1 = require("grammy");
function testOrder(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let request = yield ctx.reply(`*Просрочка  по заказу* 
курьер - Иванов Иван Иванович;
номер заказа - 175-2;
пиццерия - Тюмень-4;
время отправления - 2024-11-18 20:19;
время передачи заказа клиенту - 2024-11-18 20:48;

прогнозное время доставки (с учетом extraTime) -  22,8 минут;
фактическое время поездки - 29,6 минут;
вы превысили прогноз на  - *6,8 минут*;

В ответном сообщении напишите подробную причину задержки по доставке заказа.
С учетом указанной вами причины управляющим будет принято дальнейшее решение.`, {
            parse_mode: 'Markdown',
            reply_markup: new grammy_1.InlineKeyboard().text('Ответить', 'Ответить'),
        });
        yield conversation.waitForCallbackQuery('Ответить', {
            otherwise: (ctx) => ctx.reply('<b>Ошибка!</b> Нажмите кнопку <b>ответить!</b>', {
                reply_parameters: { message_id: request.message_id },
                parse_mode: 'HTML',
            }),
        });
        const question = yield ctx.reply(`Напишите в чат ваш ответ текстом по заказу 175-2`);
        const responceCourier = yield conversation
            .waitFor('message:text', {
            otherwise: (ctx) => ctx.reply(`<b>Ошибка!</b> Вначале ответьте на заказ 175-2. Ответ принимается только текстом`, {
                reply_parameters: { message_id: question.message_id },
                parse_mode: 'HTML',
            }),
        })
            .and((ctx) => { var _a, _b; return ((_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.length) < 350; }, {
            otherwise: (ctx) => __awaiter(this, void 0, void 0, function* () {
                return yield ctx.reply('<b>Ошибка!</b> Cлишком длинный ответ (максимум <b>350!</b> символов)', {
                    reply_parameters: { message_id: question.message_id },
                    parse_mode: 'HTML',
                });
            }),
        });
        const photo = yield ctx.reply('Хотите приложить фото к пояснению?', {
            reply_markup: new grammy_1.InlineKeyboard().text('Да', 'Да тест').text('Нет', 'Нет тест'),
        });
        const photoResponce = yield conversation.waitForCallbackQuery(['Да тест', 'Нет тест'], {
            otherwise: (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield ctx.reply(`<b>Ошибка!</b>. Выберете ответ, нажав кнопку Да/Нет`, {
                    parse_mode: 'HTML',
                    reply_parameters: { message_id: photo.message_id },
                });
            }),
        });
        if (photoResponce.callbackQuery.data === 'Да тест') {
            ctx.reply('Добавьте свое фото в чат');
            let photoCtx = yield conversation.waitFor(':photo', {
                otherwise: (ctx) => __awaiter(this, void 0, void 0, function* () { return ctx.reply('Принимаются только фото'); }),
            });
            yield photoCtx.getFile();
            yield ctx.replyWithPhoto((_b = (_a = photoCtx.message) === null || _a === void 0 ? void 0 : _a.photo.at(-1)) === null || _b === void 0 ? void 0 : _b.file_id, {
                caption: `<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу 175-2
- ${responceCourier.msg.text}

Чтобы перезаписать ответ снова нажмите <b>Ответить</b>`,
                reply_parameters: { message_id: question.message_id, quote: question.text },
                parse_mode: 'HTML',
            });
            return;
        }
        // завершение диалога без рисунка
        if (photoResponce.callbackQuery.data === 'Нет тест') {
            yield ctx.reply(`<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу 175-2
- ${responceCourier.msg.text}

Чтобы перезаписать ответ снова нажмите <b>Ответить</b>`, {
                reply_parameters: { message_id: question.message_id, quote: question.text },
                parse_mode: 'HTML',
            });
        }
    });
}
