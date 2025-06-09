import { type Context, InlineKeyboard } from 'grammy';
import { type Conversation } from '@grammyjs/conversations';
import { postDataServer } from '../../services/api';
import { getWeek } from "date-fns";

export async function raiting(conversation: Conversation, ctx: Context) {
  const week = await ctx.reply('Выберите неделю', {
    reply_markup: new InlineKeyboard()
      .text('Текущая неделя', 'Текущая неделя')
      .text('Прошедшая неделя', 'Прошедшая неделя'),
  });

  const photoWeek = await conversation.waitForCallbackQuery(['Текущая неделя', 'Прошедшая неделя'], {
    otherwise: async (ctx) => {
      await ctx.reply(`<b>Ошибка!</b>. Выберите неделю`, {
        parse_mode: 'HTML',
        reply_parameters: { message_id: week.message_id },
      });
    },
  });

  if (photoWeek.callbackQuery.data === 'Текущая неделя') {
    await conversation.external(() => {
      postDataServer('rating', {
        chatId: ctx.chatId,
        week: getWeek (new Date ()),
        content: '/rating'
      });
    });
    return;
  }

  if (photoWeek.callbackQuery.data === 'Прошедшая неделя') {
    await conversation.external(() => {
      postDataServer('rating', {
        chatId: ctx.chatId,
        week: (getWeek (new Date ())) - 1,
        content: '/rating'
      });
    });
    return;
  }
}
