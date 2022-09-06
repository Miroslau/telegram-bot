const telegramAPI = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5640874980:AAH9hreKc3vEdMTTzIYoAoc9JGTjogwfj1M';

const bot = new telegramAPI(token, {polling: true});
const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угодать!`);
  chats[chatId] = Math.floor(Math.random() * 10);
  await bot.sendMessage(chatId, `Отгадывай!`, gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Поиграем? :)'}
  ])

  bot.on('message', async msg => {
    const {text, chat: { id }, from: {first_name, last_name}} = msg;

    if (text === '/start') {
      await bot.sendSticker(id, 'https://cdn.tlgrm.app/stickers/463/343/46334338-7539-4dae-bfb6-29e0bb04dc2d/192/3.webp');
      return bot.sendMessage(id, `Добро пожаловать, меня зовут Мироша. Чем могу помочь?`);
    }
    if (text === '/info') {
      return bot.sendMessage(id, `Тебя зовут ${first_name} ${last_name}`);
    }
    if (text === '/game') {
      return startGame(id);
    }
    return bot.sendMessage(id, `Я тебя не понимаю, попробуй ещё раз!`);
  });

  bot.on('callback_query', async msg => {
    const { data, message: { chat: { id } } } = msg;
    if (data === '/again') {
      return startGame(id);
    }
    if (data === chats[id]) {
      return bot.sendMessage(id, `Поздравляю, ты отгадал цифру ${chats[id]}`, againOptions);
    } else {
      return bot.sendMessage(id, `К сожалению ты не отгадал, язагадал цифру ${chats[id]}`, againOptions);
    }
  })
}

start();
