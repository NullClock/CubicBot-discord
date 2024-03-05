const {
    SlashCommandBuilder
  } = require('discord.js');
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kid-falling-gif')
    .setDescription('Sends a GIF of a lil kiddo falling :skull:'),
  async execute(client, inr) {
    await inr.reply('https://media.tenor.com/3jf_aSHmRdYAAAPo/helio-falling.mp4');
  }
}