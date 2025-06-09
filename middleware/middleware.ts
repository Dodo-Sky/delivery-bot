import { Context, NextFunction } from 'grammy';
import { type ConversationFlavor } from '@grammyjs/conversations';

export async function responceCourier (ctx: ConversationFlavor<Context>, next: NextFunction) {
  await ctx.answerCallbackQuery();
  const [prefix, orderId] = await ctx.callbackQuery?.data!.split(':')!;
  if (prefix === 'responce') {
    await ctx.conversation.enter('responce');
  }
  await next();
}
