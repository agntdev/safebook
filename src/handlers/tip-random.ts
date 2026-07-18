import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";
import { getRandomTip, TIP_CATEGORIES } from "../data.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("tip:random", async (ctx) => {
  await ctx.answerCallbackQuery();
  const tip = getRandomTip();
  const cat = TIP_CATEGORIES[tip.category];
  const text =
    `${cat.emoji} ${tip.content}\n\n` +
    `💡 Why it matters: ${tip.explanation}\n\n` +
    `👉 Next steps: ${tip.nextSteps}`;

  await ctx.reply(text, {
    reply_markup: inlineKeyboard([
      [inlineButton("🔄 Another tip", "tip:random")],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
