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
exports.responce = responce;
var grammy_1 = require("grammy");
var api_1 = require("../../services/api");
var date_fns_1 = require("date-fns");
var files_1 = require("../../services/files");
function getOrderFromServer(orderId, departmentName) {
    return __awaiter(this, void 0, void 0, function () {
        var dataFromServer, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getDataFromServer)("".concat(departmentName, "/couriersOrder"))];
                case 1:
                    dataFromServer = _a.sent();
                    order = dataFromServer.find(function (el) { return el.orderId === orderId; });
                    if (order) {
                        return [2 /*return*/, order];
                    }
                    else
                        return [2 /*return*/, undefined];
                    return [2 /*return*/];
            }
        });
    });
}
function responce(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, orderId, departmentName, order, question, responceCourier, photo, photoResponce, photoCtx, file, uploadedFileUrl;
        var _this = this;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ((_b = ctx.callbackQuery) === null || _b === void 0 ? void 0 : _b.data.split(':'))];
                case 1:
                    _a = _e.sent(), orderId = _a[1], departmentName = _a[2];
                    return [4 /*yield*/, conversation.external(function () {
                            return getOrderFromServer(orderId, departmentName);
                        })];
                case 2:
                    order = _e.sent();
                    if (!!order) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.reply('Поездка устарела и ее нет в базе данных')];
                case 3:
                    _e.sent();
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, ctx.reply("\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0432 \u0447\u0430\u0442 \u0432\u0430\u0448 \u043E\u0442\u0432\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u043E\u043C \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 ".concat(order.orderNumber))];
                case 5:
                    question = _e.sent();
                    return [4 /*yield*/, conversation
                            .waitFor('message:text', {
                            otherwise: function (ctx) {
                                return ctx.reply("<b>\u041E\u0448\u0438\u0431\u043A\u0430!</b> \u0412\u043D\u0430\u0447\u0430\u043B\u0435 \u043E\u0442\u0432\u0435\u0442\u044C\u0442\u0435 \u043D\u0430 \u0437\u0430\u043A\u0430\u0437 ".concat(order.orderNumber, ". \u041E\u0442\u0432\u0435\u0442 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0435\u043A\u0441\u0442\u043E\u043C"), {
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
                case 6:
                    responceCourier = _e.sent();
                    return [4 /*yield*/, conversation.external(function () {
                            if (responceCourier.msg.text) {
                                var dateResponce = (0, date_fns_1.fromUnixTime)(responceCourier.msg.date).toLocaleString();
                                order.courierComment = responceCourier.msg.text;
                                order.dateResponceCourier = dateResponce;
                            }
                        })];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, ctx.reply('Хотите приложить фото к пояснению?', {
                            reply_markup: new grammy_1.InlineKeyboard().text('Да', 'Да').text('Нет', 'Нет'),
                        })];
                case 8:
                    photo = _e.sent();
                    return [4 /*yield*/, conversation.waitForCallbackQuery(['Да', 'Нет'], {
                            otherwise: function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, ctx.reply("<b>\u041E\u0448\u0438\u0431\u043A\u0430!</b>. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0443 \u0414\u0430/\u041D\u0435\u0442", {
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
                case 9:
                    photoResponce = _e.sent();
                    if (!(photoResponce.callbackQuery.data === 'Да')) return [3 /*break*/, 15];
                    ctx.reply('Добавьте свое фото в чат');
                    return [4 /*yield*/, conversation.waitFor(':photo', {
                            otherwise: function (ctx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ctx.reply('Принимаются только фото')];
                            }); }); },
                        })];
                case 10:
                    photoCtx = _e.sent();
                    return [4 /*yield*/, photoCtx.getFile()];
                case 11:
                    file = _e.sent();
                    return [4 /*yield*/, (0, files_1.uploadTelegramFileToStorage)(file.file_path)];
                case 12:
                    uploadedFileUrl = _e.sent();
                    return [4 /*yield*/, ctx.replyWithPhoto((_d = (_c = photoCtx.message) === null || _c === void 0 ? void 0 : _c.photo.at(-1)) === null || _d === void 0 ? void 0 : _d.file_id, {
                            caption: "<b>\u041E\u0442\u0447\u0435\u0442!</b>\n\u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u043F\u0440\u0438\u043D\u044F\u0442\u044B \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u044F \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 ".concat(order.orderNumber, "\n- ").concat(responceCourier.msg.text, "\n\n\u0427\u0442\u043E\u0431\u044B \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442 \u0441\u043D\u043E\u0432\u0430 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 <b>\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C</b>"),
                            reply_parameters: { message_id: question.message_id, quote: question.text },
                            parse_mode: 'HTML',
                        })];
                case 13:
                    _e.sent();
                    order.urlPhoto = uploadedFileUrl;
                    return [4 /*yield*/, conversation.external(function () {
                            (0, api_1.postDataServer)('couriersOrder', order);
                        })];
                case 14:
                    _e.sent();
                    return [2 /*return*/];
                case 15:
                    if (!(photoResponce.callbackQuery.data === 'Нет')) return [3 /*break*/, 18];
                    return [4 /*yield*/, ctx.reply("<b>\u041E\u0442\u0447\u0435\u0442!</b>\n\u0421\u043F\u0430\u0441\u0438\u0431\u043E, \u043F\u0440\u0438\u043D\u044F\u0442\u044B \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u044F \u043F\u043E \u0437\u0430\u043A\u0430\u0437\u0443 ".concat(order.orderNumber, "\n- ").concat(responceCourier.msg.text, "\n\n\u0427\u0442\u043E\u0431\u044B \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442 \u0441\u043D\u043E\u0432\u0430 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 <b>\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C</b>"), {
                            reply_parameters: { message_id: question.message_id, quote: question.text },
                            parse_mode: 'HTML',
                        })];
                case 16:
                    _e.sent();
                    return [4 /*yield*/, conversation.external(function () {
                            (0, api_1.postDataServer)('couriersOrder', order);
                        })];
                case 17:
                    _e.sent();
                    return [2 /*return*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
