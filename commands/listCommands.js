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
exports.getLisCommands = getLisCommands;
function getLisCommands(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        yield bot.api.setMyCommands([
            { command: 'qrcode', description: 'Показать QR код оплаты' },
            { command: 'faq', description: 'Ответы на частые вопросы' },
            { command: 'payment', description: 'Размеры доплат в пиццериях' },
            { command: 'mysalary', description: 'Мои доплаты' },
            { command: 'test', description: 'Обучающий заказ' },
            { command: 'my_orders', description: 'Все мои заказы за последние 24 часа' },
            { command: 'problem_orders', description: 'Проблемные поездки' },
            { command: 'rating', description: 'Рейтинг и премия за скорость' },
        ], {
            scope: {
                type: 'all_private_chats',
            },
        });
    });
}
