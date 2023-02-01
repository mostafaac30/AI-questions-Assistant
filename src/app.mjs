// Import the Telegram Bot library
// const TelegramBot = require('node-telegram-bot-api');
import TelegramBot from 'node-telegram-bot-api';
// require('dotenv').config();
// const { ChatGPTClient } = require('unofficial-chatgpt-api');
// const { chatGPT } = require('chatgpt-io').chatGPT;
import dotenv from "dotenv";
dotenv.config()
import chatGPT from "chatgpt-io";
const questionAnswersPairJson = [
  {
    "question": "عرف الهوى في اللغة",
    "answer": "مصدر  هويه إذا أحبه واشتهاه"
  },
  {
    "question": "عرف الهوى في الاصطلاح",
    "answer": "ميلان النفس إلى ما تستلذه من الشهوات من غير داعية الشرع"
  },
  {
    "question": "لاتباع الهوى أسباب، اذكر أبرزها",
    "answer": "١. عدم التعود على ضبط النفس من الصفر \n ٢.مجالسة اهل الاهواء ومصاحبتهم \n ٣.ضعف المعرفة الحقة بالله والدار الاخرة \n ٤. عدم قيام الاخرين بما يجب عليهم نحو صاحب الهوى \n ٥.حب الدنيا والركون اليها \n ٦. المسارعة على ماتشتهيه النفس من المباحات \n ٧. الجهل بالعواقب المترتبة على اتباع الهوى"
  },

]
let users = [
  {
    'id': '',
    'currentQuestionIndex': 0,
  }

]

const ask = async (modelAns, answer) => {
  let bot = new chatGPT(process.env.SESSION_TOKEN);
  await bot.waitForReady();
  let sentence = 'Detect semantic similarity just answer yes or not\n\"' + modelAns + '\"\n\"' + answer + '\"';
  console.log(sentence)
  let response = await bot.ask(sentence);
  return response;
};


// const gpt = new ChatGPTClient({
//   clearanceToken: process.env.BOT_CLEARANCE_TOKEN,
//   sessionToken0: process.env.SESSION_TOKEN,
// });

// var ask = async () => {
//   const convo = await gpt.startConversation();
//   const m1 = await convo.chat('show me some javascript code:');

//   const m2 = await convo.chat('who created you?');
//   console.log(m2.message.content.parts);
// }
// ask()

// var response = await ask('الجملة الاسمية تتكون من اسم', 'تتكون الجملة الاسمية من اسم');
// console.log(response);
// response = response.toString().toLowerCase().includes('yes') ? 'yes' : 'no';
// console.log(response);

// Replace with your bot's token
const token = '5071667812:AAGlPcxxl5y1YywybkS0t2r1gIu0Cntw0Ww';

// Create a new Telegram bot
const bot = new TelegramBot(token, { polling: true });


// Handle incoming messages
bot.on('message', async (msg) => {
  try {
    let question = 'question ' + Math.random() * 100;
    let questionIdx;
    let currentUser = users.find((v) => {
      if (v.id == msg.chat.id) { return v.currentQuestionIndex }
    });
    if (!currentUser) {
      users.push({ id: msg.chat.id, currentQuestionIndex: 0 });
      questionIdx = 0
    }
    else {
      questionIdx = currentUser.currentQuestionIndex;
    }

    console.log(questionIdx,)
    question = questionAnswersPairJson[questionIdx].question;
    const chatId = msg.chat.id;
    // check if the message is a command 
    if (msg.text.toString().toLowerCase().includes('/start')) {

      bot.sendMessage(chatId, question).catch((e) => console.log(e));

    } else {
      //call chatgpt
      // send message with correct of not
      //if not send the answer
      let modelAns = questionAnswersPairJson[questionIdx].answer;
      let userAnswer = msg.text;

      var response = await ask(modelAns, userAnswer);
      console.log(response);
      response = response.toString().toLowerCase().includes('yes') ? 'yes' : 'no';

      console.log(response);
      let answerMsg = 'Model Answer:' + modelAns + '\nCorrect: ' + response + '\nYour Answer:' + msg.text;
      bot.sendMessage(chatId, answerMsg).then((e) => {
        users.find((v) => {
          if (v.id == msg.chat.id) {
            if (v.currentQuestionIndex < questionAnswersPairJson.length) {
              v.currentQuestionIndex++
              return
            }
          }
        });
        // if (response == 'yes') {

        // }
      }).catch((e) => console.log(e));
    }
  }
  catch (e) {

  }
});
