import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({ label: "🔒 Random Tip", data: "tip:random", order: 10 });
registerMainMenuItem({ label: "📖 Browse Tips", data: "tip:categories", order: 20 });
registerMainMenuItem({ label: "🧠 Take Quiz", data: "quiz:start", order: 30 });
registerMainMenuItem({ label: "📊 My Progress", data: "profile:view", order: 40 });
registerMainMenuItem({ label: "⏰ Reminders", data: "reminders:settings", order: 50 });

const WELCOME =
  "👋 Welcome to Facebook Security Educator!\n\n" +
  "I'll help you keep your Facebook account safe with security tips, interactive quizzes, and daily lessons.";

const CONSENT_PROMPT =
  "Before we begin — would you like me to track your quiz scores and learning streak?\n\n" +
  "This helps you see your progress over time. You can change this anytime.";

const composer = new Composer<Ctx>();

composer.command("start", async (ctx) => {
  if (ctx.session.onboardingConsent === undefined) {
    ctx.session.step = "onboarding_consent";
    await ctx.reply(WELCOME + "\n\n" + CONSENT_PROMPT, {
      reply_markup: confirmKeyboard(),
    });
  } else {
    await ctx.reply(WELCOME, { reply_markup: buildMainMenu() });
  }
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: buildMainMenu() });
});

composer.callbackQuery("onboarding:yes", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.onboardingConsent = true;
  ctx.session.step = "idle";
  ctx.session.totalQuizzes = ctx.session.totalQuizzes ?? 0;
  ctx.session.bestScore = ctx.session.bestScore ?? 0;
  ctx.session.lessonStreak = ctx.session.lessonStreak ?? 0;
  await ctx.editMessageText(
    "Great! I'll track your progress so you can see how much you're learning.\n\n" +
    "Tap a button below to get started.",
    { reply_markup: buildMainMenu() },
  );
});

composer.callbackQuery("onboarding:no", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.onboardingConsent = false;
  ctx.session.step = "idle";
  await ctx.editMessageText(
    "No problem! You can still browse tips and take quizzes — I just won't save your scores.\n\n" +
    "Tap a button below to get started.",
    { reply_markup: buildMainMenu() },
  );
});

function buildMainMenu() {
  const items = [
    { text: "🔒 Random Tip", data: "tip:random" },
    { text: "📖 Browse Tips", data: "tip:categories" },
    { text: "🧠 Take Quiz", data: "quiz:start" },
    { text: "📊 My Progress", data: "profile:view" },
    { text: "⏰ Reminders", data: "reminders:settings" },
  ];
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2).map((it) => inlineButton(it.text, it.data)));
  }
  rows.push([inlineButton("❓ Help", "menu:help")]);
  return inlineKeyboard(rows);
}

function confirmKeyboard() {
  return inlineKeyboard([
    [
      inlineButton("✅ Yes, track my progress", "onboarding:yes"),
      inlineButton("❌ No thanks", "onboarding:no"),
    ],
  ]);
}

export default composer;
