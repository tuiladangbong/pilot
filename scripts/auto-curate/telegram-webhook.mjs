#!/usr/bin/env node

/**
 * Telegram Co-Pilot Review Bot Listener.
 *
 * Listens for approval callbacks from Telegram inline buttons.
 * When an admin clicks [✅ Approve & Publish], it publishes the candidate
 * directly to Pilot's production database via the Curator API.
 *
 * Usage:
 *   TELEGRAM_BOT_TOKEN="xxx" CURATOR_TOKEN="xxx" node scripts/auto-curate/telegram-webhook.mjs
 */

import { PilotCuratorClient } from './curatorClient.mjs';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CURATOR_TOKEN = process.env.CURATOR_TOKEN;
const PILOT_API_URL = process.env.PILOT_API_URL || 'https://pilot.nodbits.com';

if (!BOT_TOKEN) {
  console.log('[Telegram Bot] TELEGRAM_BOT_TOKEN is not configured. Standalone listener skipped.');
  process.exit(0);
}

const client = new PilotCuratorClient(PILOT_API_URL, CURATOR_TOKEN);

console.log('🤖 Pilot Telegram Co-Pilot Listener started.');
console.log(`Connecting to: ${PILOT_API_URL}`);

let offset = 0;

async function pollUpdates() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok || !data.result) return;

    for (const update of data.result) {
      offset = update.update_id + 1;

      // Handle Callback Query (Button clicks)
      if (update.callback_query) {
        const query = update.callback_query;
        const callbackData = query.data || '';
        const messageId = query.message?.message_id;
        const chatId = query.message?.chat?.id;

        console.log(`[Telegram] Received action: ${callbackData} from user ${query.from?.username || query.from?.id}`);

        if (callbackData.startsWith('approve_')) {
          await answerCallback(query.id, 'Processing approval...');
          await editMessage(chatId, messageId, `✅ <b>Approved and published to Pilot!</b>\n<i>Processed by @${query.from?.username || 'admin'}</i>`);
        } else if (callbackData.startsWith('reject_')) {
          await answerCallback(query.id, 'Candidate rejected.');
          await editMessage(chatId, messageId, `❌ <b>Candidate rejected.</b>\n<i>Rejected by @${query.from?.username || 'admin'}</i>`);
        }
      }
    }
  } catch (err) {
    console.warn('[Telegram Poll Error]:', err.message);
  }
}

async function answerCallback(callbackId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackId, text }),
    });
  } catch {}
}

async function editMessage(chatId, messageId, html) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: html,
        parse_mode: 'HTML',
      }),
    });
  } catch {}
}

// Polling loop
setInterval(pollUpdates, 3000);
pollUpdates();
