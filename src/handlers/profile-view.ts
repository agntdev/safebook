import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("profile:view", async (ctx) => {
  await ctx.answerCallbackQuery();

  if (!ctx.session.onboardingConsent) {
    await ctx.reply(
      "📊 Progress tracking is off.\n\n" +
      "Turn it on to see your quiz scores and learning streak.",
      {
        reply_markup: inlineKeyboard([
          [inlineButton("✅ Enable tracking", "onboarding:yes")],
          [inlineButton("⬅️ Back to menu", "menu:main")],
        ]),
      },
    );
    return;
  }

  const totalQuizzes = ctx.session.totalQuizzes ?? 0;
  const bestScore = ctx.session.bestScore ?? 0;
  const streak = ctx.session.lessonStreak ?? 0;

  if (totalQuizzes === 0) {
    await ctx.reply(
      "📊 Your progress\n\n" +
      "No quizzes taken yet.\n\n" +
      "Tap 🧠 Take Quiz to get started!",
      {
        reply_markup: inlineKeyboard([
          [inlineButton("🧠 Take Quiz", "quiz:start")],
          [inlineButton("⬅️ Back to menu", "menu:main")],
        ]),
      },
    );
    return;
  }

  await ctx.reply(
    "📊 Your progress\n\n" +
    `Quizzes taken: ${totalQuizzes}\n` +
    `Best score: ${bestScore}%\n` +
    `Learning streak: ${streak} days`,
    {
      reply_markup: inlineKeyboard([
        [inlineButton("🧠 Take Quiz", "quiz:start")],
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );
});

export default composer;
