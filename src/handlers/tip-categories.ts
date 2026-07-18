import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";
import {
  TIP_CATEGORIES,
  getTipsByCategory,
  type TipCategory,
} from "../data.js";

const CATEGORY_LIST =
  "📖 Choose a topic to explore security tips:";

const composer = new Composer<Ctx>();

composer.callbackQuery("tip:categories", async (ctx) => {
  await ctx.answerCallbackQuery();
  const rows = Object.entries(TIP_CATEGORIES).map(([key, val]) => [
    inlineButton(`${val.emoji} ${val.label}`, `tip:cat:${key}`),
  ]);
  rows.push([inlineButton("⬅️ Back to menu", "menu:main")]);
  await ctx.reply(CATEGORY_LIST, {
    reply_markup: inlineKeyboard(rows),
  });
});

composer.callbackQuery(/^tip:cat:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const category = ctx.match![1] as TipCategory;
  const catInfo = TIP_CATEGORIES[category];
  if (!catInfo) {
    await ctx.reply("Category not found. Try again from the menu.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }

  const tips = getTipsByCategory(category);
  if (tips.length === 0) {
    await ctx.reply(`No tips available for ${catInfo.label} yet.`, {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }

  const text = tips
    .map(
      (t, i) =>
        `${i + 1}. ${t.content}\n   💡 ${t.explanation}`,
    )
    .join("\n\n");

  await ctx.reply(`${catInfo.emoji} ${catInfo.label}\n\n${text}`, {
    reply_markup: inlineKeyboard([
      [inlineButton("🔄 More categories", "tip:categories")],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
