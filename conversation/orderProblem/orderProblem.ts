import { type Context, InlineKeyboard } from 'grammy';
import { type Conversation } from '@grammyjs/conversations';
import { getDataFromServer, postDataServer } from '../../services/api';
import { CouriersOrder, UnitsSettings } from '../../type/type';
import { fromUnixTime, format, addHours } from 'date-fns';
import { uploadTelegramFileToStorage } from '../../services/files';

export async function responce(conversation: Conversation, ctx: Context) {
  const [, orderId, departmentName] = await ctx.callbackQuery?.data!.split(':')!;
  
  const orderArr: [CouriersOrder] = await conversation.external(async () =>
    await postDataServer('query_telegramm', {orderId: orderId}),
  );

  if (orderArr.length < 1) {
    await ctx.reply('Поездка устарела и ее нет в базе данных');
    return;
  }

  const order: CouriersOrder = orderArr[0];
  const question = await ctx.reply(`Напишите в чат ваш ответ текстом по заказу ${order.orderNumber}`);
  const responceCourier = await conversation
    .waitFor('message:text', {
      otherwise: (ctx) =>
        ctx.reply(`<b>Ошибка!</b> Вначале ответьте на заказ ${order.orderNumber}. Ответ принимается только текстом`, {
          reply_parameters: { message_id: question.message_id },
          parse_mode: 'HTML',
        }),
    })
    .and((ctx) => ctx.msg?.text?.length! < 350, {
      otherwise: async (ctx) =>
        await ctx.reply('<b>Ошибка!</b> Cлишком длинный ответ (максимум <b>350!</b> символов)', {
          reply_parameters: { message_id: question.message_id },
          parse_mode: 'HTML',
        }),
    });

  await conversation.external(async () => {
    const unitsSettings: [UnitsSettings] = await getDataFromServer(`unitsSettings`);
    const timeZoneShift = unitsSettings.find((el) => order.unitId === el.unitId)?.timeZoneShift;
    if (responceCourier.msg.text && typeof timeZoneShift === 'number') {
      let dateResponce = format(addHours(fromUnixTime(responceCourier.msg.date), timeZoneShift), 'dd.MM.yyyy HH:mm');
      order.courierComment = responceCourier.msg.text;
      order.dateResponceCourier = dateResponce;
    }
  });

  const photo = await ctx.reply('Хотите приложить фото к пояснению?', {
    reply_markup: new InlineKeyboard().text('Да', 'Да').text('Нет', 'Нет'),
  });

  const photoResponce = await conversation.waitForCallbackQuery(['Да', 'Нет'], {
    otherwise: async (ctx) => {
      await ctx.reply(`<b>Ошибка!</b>. Нажмите кнопку Да/Нет`, {
        parse_mode: 'HTML',
        reply_parameters: { message_id: photo.message_id },
      });
    },
  });

  if (photoResponce.callbackQuery.data === 'Да') {
    ctx.reply('Добавьте свое фото в чат');
    let photoCtx = await conversation.waitFor(':photo', {
      otherwise: async (ctx) => ctx.reply('Принимаются только фото'),
    });

    const file = await photoCtx.getFile();
    const uploadedFileUrl = await uploadTelegramFileToStorage(file.file_path!);

    await ctx.replyWithPhoto(photoCtx.message?.photo.at(-1)?.file_id!, {
      caption: `<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу ${order.orderNumber}
- ${responceCourier.msg.text}

Чтобы перезаписать ответ снова нажмите <b>Ответить</b>`,
      reply_parameters: { message_id: question.message_id, quote: question.text },
      parse_mode: 'HTML',
    });
    order.urlPhoto = uploadedFileUrl;

    await conversation.external(() => {
      postDataServer('couriersOrderSQL', order);
    });
    return;
  }

  // завершение диалога без рисунка
  if (photoResponce.callbackQuery.data === 'Нет') {
    await ctx.reply(
      `<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу ${order.orderNumber}
- ${responceCourier.msg.text}

Чтобы перезаписать ответ снова нажмите <b>Ответить</b>`,
      {
        reply_parameters: { message_id: question.message_id, quote: question.text },
        parse_mode: 'HTML',
      },
    );
    await conversation.external(() => {
      postDataServer('couriersOrderSQL', order);
    });
    return;
  }
}
