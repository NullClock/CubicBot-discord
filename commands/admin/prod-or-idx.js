const {
    SlashCommandBuilder
  } = require('discord.js');
  const fs = require('fs');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('prod-or-idx')
      .setDescription('Returns the current server environment (prod-01 or idx-01).'),
    async execute(client, inr) {
      if (fs.existsSync('/home/user/cubicbot-discord/.idx')) {
        await inr.reply(':tools: ``Using idx-01.``');
      } else {
        await inr.reply(':white_check_mark: ``Using prod-01!``');
      }
    }
  }