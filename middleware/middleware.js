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
exports.responceCourier = responceCourier;
function responceCourier(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield ctx.answerCallbackQuery();
        const [prefix, orderId] = yield ((_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.data.split(':'));
        if (prefix === 'responce') {
            yield ctx.conversation.enter('responce');
        }
        yield next();
    });
}
let date1 = new Date();
console.log(date1);
