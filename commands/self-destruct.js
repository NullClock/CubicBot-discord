const {
    SlashCommandBuilder
  } = require('discord.js');
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName('self-destruct')
    .setDescription('Self destructs myself (noooo :sob:)'),
  async execute(client, inr) {
    await inr.reply('Self-destructing (y u do dis? :sob:)');
    client.setStatus('offline');
    await sleep(8000);
    client.setStatus('online');
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}