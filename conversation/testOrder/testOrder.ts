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

  const question = await ctx.reply(`Напишите в чат ваш ответ текстом по заказу 175-2`);

  const responceCourier = await conversation
    .waitFor('message:text', {
      otherwise: (ctx) =>
        ctx.reply(`<b>Ошибка!</b> Вначале ответьте на заказ 175-2. Ответ принимается только текстом`, {
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
    await ctx.replyWithPhoto(photoCtx.message?.photo.at(-1)?.file_id!, {
      caption: `<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу 175-2
- ${responceCourier.msg.text}`,
      reply_parameters: { message_id: question.message_id, quote: question.text },
      parse_mode: 'HTML',
    });
    return;
  }

  // завершение диалога без рисунка
  if (photoResponce.callbackQuery.data === 'Нет тест') {
    await ctx.reply(
      `<b>Отчет!</b>
Спасибо, приняты следующие пояснения по заказу 175-2
- ${responceCourier.msg.text}`,
      {
        reply_parameters: { message_id: question.message_id, quote: question.text },
        parse_mode: 'HTML',
      },
    );
  }
}
