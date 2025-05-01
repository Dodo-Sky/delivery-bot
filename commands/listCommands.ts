export async function getLisCommands(bot: any) {
  await bot.api.setMyCommands(
    [
      { command: 'qrcode', description: 'Показать QR код оплаты' },
      { command: 'faq', description: 'Ответы на частые вопросы' },
      { command: 'payment', description: 'Размеры доплат в пиццериях' },
      { command: 'mysalary', description: 'Мои доплаты' },
      { command: 'test', description: 'Обучающий заказ' },
      { command: 'my_orders', description: 'Все мои заказы за последние 24 часа' },
      { command: 'problem_orders', description: 'Проблемные поездки' },
    ],
    {
      scope: {
        type: 'all_private_chats',
      },
    },
  );
}
