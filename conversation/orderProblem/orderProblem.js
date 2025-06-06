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
exports.responce = responce;
const grammy_1 = require("grammy");
const api_1 = require("../../services/api");
const date_fns_1 = require("date-fns");
const files_1 = require("../../services/files");
function responce(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const [, orderId, departmentName] = yield ((_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.data.split(':'));
        const orderArr = yield conversation.external(() => __awaiter(this, void 0, void 0, function* () { return yield (0, api_1.postDataServer)('query_telegramm', { orderId: orderId }); }));
        if (orderArr.length === 0) {
            yield ctx.reply('Поездка устарела и ее нет в базе данных');
            return;
        }
        const order = orderArr[0];
        const question = yield ctx.reply(`Напишите в чат ваш ответ текстом по заказу ${order.orderNumber}`);
        const responceCourier = yield conversation
            .waitFor('message:text', {
            otherwise: (ctx) => ctx.reply(`<b>Ошибка!</b> Вначале ответьте на заказ ${order.orderNumber}. Ответ принимается только текстом`, {
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
        yield conversation.external(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const unitsSettings = yield (0, api_1.getDataFromServer)(`unitsSettings`);
            const timeZoneShift = (_a = unitsSettings.find((el) => order.unitId === el.unitId)) === null || _a === void 0 ? void 0 : _a.timeZoneShift;
            if (responceCourier.msg.text && typeof timeZoneShift === 'number') {
                let dateResponce = (0, date_fns_1.format)((0, date_fns_1.addHours)((0, date_fns_1.fromUnixTime)(responceCourier.msg.date), timeZoneShift), 'dd.MM.yyyy HH:mm');
                order.courierComment = responceCourier.msg.text;
                order.dateResponceCourier = dateResponce;
            }
        }));
        const photo = yield ctx.reply('Хотите приложить фото к пояснению?', {
            reply_markup: new grammy_1.InlineKeyboard().text('Да', 'Да').text('Нет', 'Нет'),
        });
        const photoResponce = yield conversation.waitForCallbackQuery(['Да', 'Нет'], {
            otherwise: (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield ctx.reply(`<b>Ошибка!</b>. Нажмите кнопку Да/Нет`, {
                    parse_mode: 'HTML',
                    reply_parameters: { message_id: photo.message_id },
                });
            }),
        });
        if (photoResponce.callbackQuery.data === 'Да') {
            ctx.reply('Добавьте свое фото в чат');
            let photoCtx = yield conversation.waitFor(':photo', {
                otherwise: (ctx) => __awaiter(this, void 0, void 0, function* () { return ctx.reply('Принимаются только фото'); }),
            });
            const file = yield photoCtx.getFile();
            const uploadedFileUrl = yield (0, files_1.uploadTelegramFileToStorage)(file.file_path);
            yield ctx.replyWithPhoto((_c = (_b = photoCtx.message) === null || _b === void 0 ? void 0 : _b.photo.at(-1)) === null || _c === void 0 ? void 0 : _c.file_id, {
                caption: `<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу ${order.orderNumber}
- ${responceCourier.msg.text}

Чтобы перезаписать ответ снова нажмите <b>Ответить</b>`,
                reply_parameters: { message_id: question.message_id, quote: question.text },
                parse_mode: 'HTML',
            });
            order.urlPhoto = uploadedFileUrl;
            yield conversation.external(() => {
                (0, api_1.postDataServer)('couriersOrderSQL', order);
            });
            return;
        }
        // завершение диалога без рисунка
        if (photoResponce.callbackQuery.data === 'Нет') {
            yield ctx.reply(`<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу ${order.orderNumber}
- ${responceCourier.msg.text}

Чтобы перезаписать ответ снова нажмите <b>Ответить</b>`, {
                reply_parameters: { message_id: question.message_id, quote: question.text },
                parse_mode: 'HTML',
            });
            yield conversation.external(() => {
                (0, api_1.postDataServer)('couriersOrderSQL', order);
            });
            return;
        }
    });
}
