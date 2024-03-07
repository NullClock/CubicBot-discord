const {
  SlashCommandBuilder
} = require('discord.js');
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Rates something')
		.addStringOption(option =>
			option.setName('thing')
				.setDescription('The thing to rape- oops, rate...')
				.setRequired(true)),
  async execute(client, inr) {
		const thing = inr.options.getString('thing');
    await inr.reply(`I rate ${thing} a ${rate(thing)}%`);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rate(item) {
	let hash = 0;
  for (let i = 0; i < item.length(); i++) {
    hash = (hash << 5) - hash + item.charCodeAt(i);
  }
	let res = (Math.abs(hash) % 100) + 1;

	return res;
}