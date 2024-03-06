const {
    SlashCommandBuilder
  } = require('discord.js');
  const fs = require('fs');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('shutdown-idx-01')
      .setDescription('Shuts down idx-01.'),
    async execute(client, inr) {
      if (fs.existsSync('../thisisidx')) {
        await inr.reply(':gear: ``Shutting down idx-01...``');
        await client.destroy();
        await inr.reply(':no_entry: ``There was an error shutting off idx-01.``');
      } else {
        await inr.reply(':x: ``The bot is already using prod-01.``');
      }
    }
  }