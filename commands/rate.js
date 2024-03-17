const {
  SlashCommandBuilder
} = require('discord.js');

const replaceWith = {
	"your": "my",
	"my": "your",
	"me": "you",
	"you": "I",
	"I": "you"
};
  
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Rates something')
		.addStringOption(option =>
			option.setName('thing')
				.setDescription('The thing to rate')
				.setRequired(true)),
  async execute(client, inr) {
		const thing = replaceYouMe(inr.options.getString('thing'));
    await inr.reply(`I rate ${thing} a ${rate(thing)}%`);
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function replaceYouMe(text) {
	for (const key of Object.keys(replaceWith)) {
		text = text.replace(key, replaceWith[key]);
	}

	return text;
}

function rate(item) {
	let hash = 0;
  for (let i = 0; i < item.length; i++) {
    hash = (hash << 5) - hash + item.charCodeAt(i);
  }
	let res = (Math.abs(hash) % 100) + 1;

	return res;
}
