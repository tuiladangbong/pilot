/**
 * Telegram Notification & Co-Pilot Review Bot.
 * Sends real-time curation alerts and interactive approval cards to an admin Telegram channel.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export class TelegramNotifier {
  constructor(botToken = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.enabled = Boolean(botToken && chatId);
  }

  async sendMessage(htmlText, replyMarkup = null) {
    if (!this.enabled) return false;

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const payload = {
      chat_id: this.chatId,
      text: htmlText,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data.ok === true;
    } catch (err) {
      console.warn('[Telegram Notifier] Failed sending message:', err.message);
      return false;
    }
  }

  async notifyPublished(tool, workflow = null, prompt = null) {
    if (!this.enabled) return;

    const starsOrPoints = tool.sourceMetadata?.stars
      ? `⭐ ${tool.sourceMetadata.stars.toLocaleString()} Stars`
      : tool.sourceMetadata?.points
      ? `🔥 ${tool.sourceMetadata.points} HN Points`
      : '';

    const text = `
🚀 <b>[Pilot AI Hub] New Resource Auto-Published!</b>

<b>Title:</b> <a href="${escapeHtml(tool.url)}">${escapeHtml(tool.title)}</a>
<b>Category:</b> #${escapeHtml(tool.category.replace(/\s+/g, ''))}
<b>Pricing:</b> ${escapeHtml(tool.pricing)}
<b>Quality Score:</b> <b>${tool.qualityScore} / 10.0</b> ${starsOrPoints ? `(${starsOrPoints})` : ''}

<b>Summary:</b>
${escapeHtml(tool.description)}

<b>Tags:</b> ${(tool.tags || []).map((t) => `#${escapeHtml(t)}`).join(' ')}
${workflow ? `\n📋 <b>Paired Workflow:</b> ${escapeHtml(workflow.title)} (${workflow.steps.length} steps)` : ''}
${prompt ? `\n💡 <b>Prompt Template:</b> Generated and linked.` : ''}

🌐 <i>Live on <a href="https://pilot.nodbits.com">pilot.nodbits.com</a></i>
    `.trim();

    await this.sendMessage(text);
  }

  async notifyPendingReview(tool, candidateId) {
    if (!this.enabled) return;

    const text = `
⏳ <b>[Pilot Curation] Candidate Pending Review</b>

<b>Title:</b> <a href="${escapeHtml(tool.url)}">${escapeHtml(tool.title)}</a>
<b>Category:</b> #${escapeHtml(tool.category.replace(/\s+/g, ''))} | <b>Pricing:</b> ${escapeHtml(tool.pricing)}
<b>Quality Score:</b> <b>${tool.qualityScore} / 10.0</b>

<b>Summary:</b>
${escapeHtml(tool.description)}

<i>Review candidate and choose action below:</i>
    `.trim();

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ Approve & Publish', callback_data: `approve_${candidateId}` },
          { text: '❌ Reject', callback_data: `reject_${candidateId}` },
        ],
        [
          { text: '🔗 Open Tool Website', url: tool.url },
        ],
      ],
    };

    await this.sendMessage(text, inlineKeyboard);
  }
}
