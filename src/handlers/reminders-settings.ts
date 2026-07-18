import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("reminders:settings", async (ctx) => {
  await ctx.answerCallbackQuery();
  const enabled = ctx.session.remindersEnabled ?? false;
  const status = enabled ? "ON" : "OFF";
  const emoji = enabled ? "✅" : "⏸️";

  const actionButton = enabled
    ? inlineButton("🔕 Turn off reminders", "reminders:off")
    : inlineButton("🔔 Turn on reminders", "reminders:on");

  await ctx.reply(
    `${emoji} Daily security reminders are ${status}.\n\n` +
    (enabled
      ? "You'll receive a daily security tip and quiz question to keep your skills sharp."
      : "Turn on reminders to get a daily security tip and quiz question delivered to you."),
    {
      reply_markup: inlineKeyboard([
        [actionButton],
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );
});

composer.callbackQuery("reminders:on", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.remindersEnabled = true;
  await ctx.editMessageText(
    "✅ Daily security reminders are now ON.\n\n" +
    "You'll get a security tip and quiz question each day to keep your knowledge fresh.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("🔕 Turn off reminders", "reminders:off")],
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );
});

composer.callbackQuery("reminders:off", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.remindersEnabled = false;
  await ctx.editMessageText(
    "⏸️ Daily security reminders are now OFF.\n\n" +
    "You can turn them back on anytime from the menu.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("🔔 Turn on reminders", "reminders:on")],
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );
});

export default composer;
