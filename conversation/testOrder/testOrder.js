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
exports.testOrder = testOrder;
var grammy_1 = require("grammy");
function testOrder(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var request, question, responceCourier, photo, photoResponce, photoCtx;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.reply("*\u041F\u0440\u043E\u0441\u0440\u043E\u0447\u043A\u0430  \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443* \n\u043A\u0443\u0440\u044C\u0435\u0440 - \u0418\u0432\u0430\u043D\u043E\u0432 \u0418\u0432\u0430\u043D \u0418\u0432\u0430\u043D\u043E\u0432\u0438\u0447;\n\u043D\u043E\u043C\u0435\u0440 \u0437\u0430\u043A\u0430\u0437\u0430 - 175-2;\n\u043F\u0438\u0446\u0446\u0435\u0440\u0438\u044F - \u0422\u044E\u043C\u0435\u043D\u044C-4;\n\u0432\u0440\u0435\u043C\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F - 2024-11-18 20:19;\n\u0432\u0440\u0435\u043C\u044F \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u0437\u0430\u043A\u0430\u0437\u0430 \u043A\u043B\u0438\u0435\u043D\u0442\u0443 - 2024-11-18 20:48;\n\n\u043F\u0440\u043E\u0433\u043D\u043E\u0437\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 (\u0441 \u0443\u0447\u0435\u0442\u043E\u043C extraTime) -  22,8 \u043C\u0438\u043D\u0443\u0442;\n\u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u043F\u043E\u0435\u0437\u0434\u043A\u0438 - 29,6 \u043C\u0438\u043D\u0443\u0442;\n\u0432\u044B \u043F\u0440\u0435\u0432\u044B\u0441\u0438\u043B\u0438 \u043F\u0440\u043E\u0433\u043D\u043E\u0437 \u043D\u0430  - *6,8 \u043C\u0438\u043D\u0443\u0442*;\n\n\u0412 \u043E\u0442\u0432\u0435\u0442\u043D\u043E\u043C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0438 \u043D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0443\u044E \u043F\u0440\u0438\u0447\u0438\u043D\u0443 \u0437\u0430\u0434\u0435\u0440\u0436\u043A\u0438 \u043F\u043E \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u0437\u0430\u043A\u0430\u0437\u0430.\n\u0421 \u0443\u0447\u0435\u0442\u043E\u043C \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u0439 \u0432\u0430\u043C\u0438 \u043F\u0440\u0438\u0447\u0438\u043D\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u044E\u0449\u0438\u043C \u0431\u0443\u0434\u0435\u0442 \u043F\u0440\u0438\u043D\u044F\u0442\u043E \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0435\u0435 \u0440\u0435\u0448\u0435\u043D\u0438\u0435.", {
                        parse_mode: 'Markdown',
                        reply_markup: new grammy_1.InlineKeyboard().text('Ответить', 'Ответить'),
                    })];
                case 1:
                    request = _a.sent();
                    return [4 /*yield*/, conversation.waitForCallbackQuery('Ответить', {
                            otherwise: function (ctx) {
                                return ctx.reply('<b>Ошибка!</b> Нажмите кнопку <b>ответить!</b>', {
                                    reply_parameters: { message_id: request.message_id },
                                    parse_mode: 'HTML',
                                });
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.reply("\u041E\u0442\u0432\u0435\u0442 \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 175-2", {
                            reply_markup: { force_reply: true },
                        })];
                case 3:
                    question = _a.sent();
                    return [4 /*yield*/, conversation
                            .waitForReplyTo(question.message_id, {
                            otherwise: function (ctx) {
                                return ctx.reply('<b>Ошибка!</b> Ответьте на заказ 175-2', {
                                    reply_parameters: { message_id: question.message_id },
                                    parse_mode: 'HTML',
                                });
                            },
                        })
                            .and(function (ctx) { var _a, _b; return ((_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.length) < 350; }, {
                            otherwise: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, ctx.reply('<b>Ошибка!</b> Cлишком длинный ответ (максимум <b>350!</b> символов)', {
                                                reply_parameters: { message_id: question.message_id },
                                                parse_mode: 'HTML',
                                            })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); },
                        })];
                case 4:
                    responceCourier = _a.sent();
                    return [4 /*yield*/, ctx.reply('Хотите приложить фото к пояснению?', {
                            reply_markup: new grammy_1.InlineKeyboard().text('Да', 'Да тест').text('Нет', 'Нет тест'),
                        })];
                case 5:
                    photo = _a.sent();
                    return [4 /*yield*/, conversation.waitForCallbackQuery(['Да тест', 'Нет тест'], {
                            otherwise: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, ctx.reply("<b>\u041E\u0448\u0438\u0431\u043A\u0430!</b>. \u0412\u044B\u0431\u0435\u0440\u0435\u0442\u0435 \u043E\u0442\u0432\u0435\u0442, \u043D\u0430\u0436\u0430\u0432 \u043A\u043D\u043E\u043F\u043A\u0443 \u0414\u0430/\u041D\u0435\u0442", {
                                                parse_mode: 'HTML',
                                                reply_parameters: { message_id: photo.message_id },
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        })];
                case 6:
                    photoResponce = _a.sent();
                    if (!(photoResponce.callbackQuery.data === 'Да тест')) return [3 /*break*/, 10];
                    ctx.reply('Добавьте свое фото в чат');
                    return [4 /*yield*/, conversation.waitFor(':photo', {
                            otherwise: function (ctx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ctx.reply('Принимаются только фото')];
                            }); }); },
                        })];
                case 7:
                    photoCtx = _a.sent();
                    return [4 /*yield*/, photoCtx.getFile()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, photoCtx.reply("\u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u0432\u0430\u0448\u0438 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u044F \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 175-2 <b>\u043F\u0440\u0438\u043D\u044F\u0442\u044B</b>, \u0444\u043E\u0442\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E", {
                            parse_mode: 'HTML',
                        })];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
                case 10:
                    if (!(photoResponce.callbackQuery.data === 'Нет тест')) return [3 /*break*/, 12];
                    return [4 /*yield*/, ctx.reply("\u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u0432\u0430\u0448\u0438 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u044F \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 175-2 <b>\u043F\u0440\u0438\u043D\u044F\u0442\u044B</b>", {
                            parse_mode: 'HTML',
                            reply_parameters: { message_id: question.message_id, quote: question.text },
                        })];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
