import { type Context, InlineKeyboard } from 'grammy';
import { type Conversation } from '@grammyjs/conversations';
import { getDataFromServer, postDataServer } from '../../services/api';
import { CouriersOrder } from '../../type/type';
import { fromUnixTime } from 'date-fns';
import { uploadTelegramFileToStorage } from '../../services/files';

async function getOrderFromServer(orderId: string, departmentName: string): Promise<CouriersOrder | undefined> {
  const dataFromServer: CouriersOrder[] = await getDataFromServer(`${departmentName}/couriersOrder`);
  const order: CouriersOrder | undefined = dataFromServer.find((el: CouriersOrder) => el.orderId === orderId);
  if (order) {
    return order;
  } else return undefined;
}

export async function responce(conversation: Conversation, ctx: Context) {
  const [, orderId, departmentName] = await ctx.callbackQuery?.data!.split(':')!;
  const order: CouriersOrder | undefined = await conversation.external(() =>
    getOrderFromServer(orderId, departmentName),
  );
  if (!order) {
    await ctx.reply('Поездка устарела и ее нет в базе данных');
    return;
  }

  let question = await ctx.reply(`Ответ по заказу ${order.orderNumber}`, {
    reply_markup: { force_reply: true },
  });

  const responceCourier = await conversation
    .waitForReplyTo(question.message_id, {
      otherwise: (ctx) =>
        ctx.reply(`<b>Ошибка!</b> Вначале ответьте на заказ ${order.orderNumber}`, {
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

  await conversation.external(() => {
    if (responceCourier.msg.text) {
      let dateResponce = fromUnixTime(responceCourier.msg.date).toLocaleString();
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
    console.log(uploadedFileUrl);
    await photoCtx.reply(`Спасибо, ваши пояснения по заказу ${order.orderNumber} <b>приняты</b>, фото загружено`, {
      parse_mode: 'HTML',
    });
    order.urlPhoto = uploadedFileUrl;
    await conversation.external(() => {
      postDataServer('couriersOrder', order);
    });
    return;
  }

  // завершение диалога без рисунка
  if (photoResponce.callbackQuery.data === 'Нет') {
    await ctx.reply(`Спасибо, ваши пояснения по заказу ${order.orderNumber} <b>приняты</b>`, {
      parse_mode: 'HTML',
      reply_parameters: { message_id: question.message_id, quote: question.text },
    });
    await conversation.external(() => {
      postDataServer('couriersOrder', order);
    });
    return;
  }
}