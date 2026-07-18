import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";
import {
  TIP_CATEGORIES,
  getQuizzesByTopic,
  QUIZZES,
  type TipCategory,
} from "../data.js";

const TOPIC_PROMPT = "🧠 Pick a topic for your quiz:";

const composer = new Composer<Ctx>();

function buildTopicMenu() {
  const cats = Object.entries(TIP_CATEGORIES);
  const rows = cats.map(([key, val]) => [
    inlineButton(`${val.emoji} ${val.label}`, `quiz:topic:${key}`),
  ]);
  rows.push([inlineButton("⬅️ Back to menu", "menu:main")]);
  return inlineKeyboard(rows);
}

composer.callbackQuery("quiz:start", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "quiz_choosing_topic";
  await ctx.reply(TOPIC_PROMPT, { reply_markup: buildTopicMenu() });
});

composer.callbackQuery(/^quiz:topic:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const topic = ctx.match![1] as TipCategory;
  const catInfo = TIP_CATEGORIES[topic];
  if (!catInfo) {
    await ctx.reply("Topic not found. Try again.", {
      reply_markup: buildTopicMenu(),
    });
    return;
  }

  const questions = getQuizzesByTopic(topic);
  if (questions.length === 0) {
    await ctx.reply(`No quiz questions available for ${catInfo.label} yet. Try another topic.`, {
      reply_markup: buildTopicMenu(),
    });
    return;
  }

  ctx.session.quizTopic = topic;
  ctx.session.quizQuestionIndex = 0;
  ctx.session.quizScore = 0;
  ctx.session.quizTotal = questions.length;
  ctx.session.quizAnswers = {};
  ctx.session.step = "quiz_answering";

  await sendQuestion(ctx, topic, 0);
});

async function sendQuestion(ctx: Ctx, topic: TipCategory, index: number) {
  const questions = getQuizzesByTopic(topic);
  const q = questions[index];
  if (!q) return;

  const optionButtons = q.options.map((opt, i) => [
    inlineButton(opt, `quiz:ans:${index}:${i}`),
  ]);

  const progress = `Question ${index + 1} of ${questions.length}`;
  const scoreText = ctx.session.quizScore ? `Score: ${ctx.session.quizScore}/${index}` : "";

  const header = progress + (scoreText ? ` • ${scoreText}` : "");

  await ctx.reply(`${header}\n\n${q.question}`, {
    reply_markup: inlineKeyboard(optionButtons),
  });
}

composer.callbackQuery(/^quiz:ans:(\d+):(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const questionIndex = parseInt(ctx.match![1], 10);
  const answerIndex = parseInt(ctx.match![2], 10);

  const topic = ctx.session.quizTopic as TipCategory;
  if (!topic) {
    await ctx.reply("Something went wrong. Let's start over.", {
      reply_markup: inlineKeyboard([[inlineButton("🧠 Take Quiz", "quiz:start")]]),
    });
    return;
  }

  const questions = getQuizzesByTopic(topic);
  const q = questions[questionIndex];
  if (!q) return;

  if (ctx.session.quizAnswers?.[questionIndex] !== undefined) return;

  ctx.session.quizAnswers = ctx.session.quizAnswers ?? {};
  ctx.session.quizAnswers[questionIndex] = answerIndex;

  const isCorrect = answerIndex === q.correctAnswer;
  if (isCorrect) {
    ctx.session.quizScore = (ctx.session.quizScore ?? 0) + 1;
  }

  const resultEmoji = isCorrect ? "✅" : "❌";
  const resultText = isCorrect ? "Correct!" : "Not quite.";

  const nextIndex = questionIndex + 1;
  const hasMore = nextIndex < questions.length;

  const buttons = [];
  if (hasMore) {
    buttons.push([inlineButton("➡️ Next question", `quiz:next:${nextIndex}`)]);
  } else {
    buttons.push([inlineButton("📊 See results", "quiz:results")]);
  }
  buttons.push([inlineButton("⬅️ Back to menu", "menu:main")]);

  await ctx.reply(
    `${resultEmoji} ${resultText}\n\n` +
    `💡 ${q.explanation}`,
    { reply_markup: inlineKeyboard(buttons) },
  );
});

composer.callbackQuery(/^quiz:next:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const nextIndex = parseInt(ctx.match![1], 10);
  const topic = ctx.session.quizTopic as TipCategory;
  if (!topic) return;

  ctx.session.step = "quiz_answering";
  await sendQuestion(ctx, topic, nextIndex);
});

composer.callbackQuery("quiz:results", async (ctx) => {
  await ctx.answerCallbackQuery();
  const score = ctx.session.quizScore ?? 0;
  const total = ctx.session.quizTotal ?? 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  let feedback: string;
  if (percentage >= 80) {
    feedback = "🎉 Excellent! You really know your security stuff!";
  } else if (percentage >= 50) {
    feedback = "👍 Good effort! Review the tips to improve your score.";
  } else {
    feedback = "📚 Keep learning! Check out the security tips to boost your knowledge.";
  }

  if (ctx.session.onboardingConsent) {
    ctx.session.totalQuizzes = (ctx.session.totalQuizzes ?? 0) + 1;
    ctx.session.bestScore = Math.max(ctx.session.bestScore ?? 0, percentage);
    ctx.session.lessonStreak = (ctx.session.lessonStreak ?? 0) + 1;
  }

  ctx.session.step = "idle";
  ctx.session.quizTopic = undefined;
  ctx.session.quizQuestionIndex = undefined;
  ctx.session.quizAnswers = {};

  const buttons = [
    [inlineButton("🧠 Take another quiz", "quiz:start")],
    [inlineButton("📊 My Progress", "profile:view")],
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ];

  await ctx.reply(
    `Quiz complete!\n\n` +
    `Your score: ${score}/${total} (${percentage}%)\n\n` +
    feedback,
    { reply_markup: inlineKeyboard(buttons) },
  );
});

export default composer;
