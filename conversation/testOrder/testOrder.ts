import { type Context, InlineKeyboard } from 'grammy';
import { type Conversation } from '@grammyjs/conversations';

export async function testOrder(conversation: Conversation, ctx: Context) {
  let request = await ctx.reply(
    `*Просрочка  по заказу* 
курьер - Иванов Иван Иванович;
номер заказа - 175-2;
пиццерия - Тюмень-4;
время отправления - 2024-11-18 20:19;
время передачи заказа клиенту - 2024-11-18 20:48;

прогнозное время доставки (с учетом extraTime) -  22,8 минут;
фактическое время поездки - 29,6 минут;
вы превысили прогноз на  - *6,8 минут*;

В ответном сообщении напишите подробную причину задержки по доставке заказа.
С учетом указанной вами причины управляющим будет принято дальнейшее решение.`,
    {
      parse_mode: 'Markdown',
      reply_markup: new InlineKeyboard().text('Ответить', 'Ответить'),
    },
  );

  await conversation.waitForCallbackQuery('Ответить', {
    otherwise: (ctx) =>
      ctx.reply('<b>Ошибка!</b> Нажмите кнопку <b>ответить!</b>', {
        reply_parameters: { message_id: request.message_id },
        parse_mode: 'HTML',
      }),
  });

  let question = await ctx.reply(`Ответ по заказу 175-2`, {
    reply_markup: { force_reply: true },
  });

  const responceCourier = await conversation
    .waitForReplyTo(question.message_id, {
      otherwise: (ctx) =>
        ctx.reply('<b>Ошибка!</b> Ответьте на заказ 175-2', {
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

  const photo = await ctx.reply('Хотите приложить фото к пояснению?', {
    reply_markup: new InlineKeyboard().text('Да', 'Да тест').text('Нет', 'Нет тест'),
  });

  const photoResponce = await conversation.waitForCallbackQuery(['Да тест', 'Нет тест'], {
    otherwise: async (ctx) => {
      await ctx.reply(`<b>Ошибка!</b>. Выберете ответ, нажав кнопку Да/Нет`, {
        parse_mode: 'HTML',
        reply_parameters: { message_id: photo.message_id },
      });
    },
  });

  if (photoResponce.callbackQuery.data === 'Да тест') {
    ctx.reply('Добавьте свое фото в чат');
    let photoCtx = await conversation.waitFor(':photo', {
      otherwise: async (ctx) => ctx.reply('Принимаются только фото'),
    });

    await photoCtx.getFile();
    await photoCtx.reply(`Спасибо, ваши пояснения по заказу 175-2 <b>приняты</b>, фото загружено`, {
      parse_mode: 'HTML',
    });
    return;
  }

  // завершение диалога без рисунка
  if (photoResponce.callbackQuery.data === 'Нет тест') {
    console.log('11111');
    await ctx.reply(`Спасибо, ваши пояснения по заказу 175-2 <b>приняты</b>`, {
      parse_mode: 'HTML',
      reply_parameters: { message_id: question.message_id, quote: question.text },
    });
  }
}
