const {
  SlashCommandBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('[BOT ADMIN] Shuts down the bot.'),
  async code(client, inr) {
    await inr.reply('Shutting down...');
    await client.destroy();
  }
}