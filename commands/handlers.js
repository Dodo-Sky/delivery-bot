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
exports.qrcode = qrcode;
exports.payment = payment;
exports.mysalary = mysalary;
exports.problem_orders = problem_orders;
exports.my_orders = my_orders;
exports.faq = faq;
exports.start = start;
const api_1 = require("../services/api");
function qrcode(ctx) {
    (0, api_1.postDataServer)('qrcode', { content: '/qrcode', chatId: ctx.chatId });
}
function payment(ctx) {
    (0, api_1.postDataServer)('payment', { content: '/payment', chatId: ctx.chatId });
}
function mysalary(ctx) {
    (0, api_1.postDataServer)('mysalary', { content: '/mysalary', chatId: ctx.chatId });
}
function problem_orders(ctx) {
    (0, api_1.postDataServer)('problem_orders', { content: '/problem_orders', chatId: ctx.chatId });
}
function my_orders(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, api_1.postDataServer)('my_orders', { content: '/my_orders', chatId: ctx.chatId });
    });
}
function faq() {
    const message = `
*Как ответить боту?*
1. Обязательно нажмите кнопку "Ответить". Для того, чтобы бот принял ответ необходимо нажать кнопку "Ответить" и только после этого писать сообщение с ответом. 
2. Напишите сообщение с объяснением, почему время доставки заказа до клиента было превышено.
3. После написания ответа отправьте сообщение в телеграмм.
4. Дождитесь отчета от системы (бота), что ответ принят. Если отчета нет, значит ответ не был записан.


*Как проверить подключен ли мой аккаунт к боту уведомлений телеграмм?*
Выберите команду мои заказы (/myorders).  Если вы видите список со своими заказами (или уведомление об их отсутствии), то проверьте, что бот верно указал ваше имя. Если заказов нет, то бот порекомендует обратиться к управляющему.

*Вопрос - как опереляется прогнозное время доставки?*
Прогнозное время доставки складывается из следующих составляющих:
- прогнозное время поездки Яндекс от пиццерии до клиента (в одну сторону) после нажатия кнопки "Поехали";
- плюс 4 минуты предоставляется на выдачу заказа клиенту (лифт, расчет и прочее);
- плюс минуты добавочного времени (Extra time). Добавочное время составляет от 0 до 3 минут и указывается в сообщении о нарушении сроков доставки заказа.

*Условие попадания заказа на проверку*	
Основное условие попадания заказа на проверку это задержка более,  чем на 3 минуты от прогнозного времени доставки (прогнозное время поездки Яндекс + 4 минуты на передачу заказа + Extra time). 
Если в результате доставки был выдан сертификат, то заказ попадет на проверку в случае превышения прогнозного времени доставки.
Если вы объединяете несколько заказов за одну поездку то важно установить корректный маршрут отправления.
Не учитываются некорректные заказы (заказы, отмеченные выданными далее 300 метров от клиента).

*Когда курьер получает уведомление по заказу, попавшему на проверку?*
В случае, если заказ, доставленный курьером, попадает на проверку, система отправит уведомление курьеру через один час.

*Если курьер не ответил на сообщение, что произойдет?*	
Бот будет первые 2 дня писать курьеру в 09:00 письмо с просьбой дать пояснения по просрочке. 
Если по истечении 2-х дней курьер не написал ответа по просрочке, то будет написано письмо уже ответственному за график курьеров, чтобы тот связался с курьером.

*Неверное транспортное средство*
- выбрано пешком и прогнозное время дольше 12 минут (слишком дальний поход);
- выбран велосипед.

*Как узнать свой ID идентификатор в телеграмм?*
Чтобы узнать свой ID установи в контакт @my_id_bot. И потом через команду /id узнай идентификатор`;
    return message;
}
function start() {
    return `
Приветствую тебя. Я бот Додо пицца и буду подсказывать тебе если что то не так будет с заказами. Покажи это сообщение своему управляющему. Надеюсь что не буду тебя сильно беспокоить.
`;
}
