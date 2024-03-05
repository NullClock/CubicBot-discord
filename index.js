const {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

client.on('ready', () => {
  console.log(`${client.user.tag} is alive!`);
});

client.commands = new Collection();
const commands = [];
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;
const REST = new REST({ version: '10' }).setToken(TOKEN);
const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

files.forEach(file => {
  const command = require(`./commands/${file}`);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON())
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
});

(async()=>{
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: commands },
		);
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch(e) {
    console.error(`[ERROR] Error when registering slash commands: ${e}`);
  }
})();

client.on('interactionCreate', async (inr) => {
  if (!inr.isChatInputCommand()) return;
  const command = client.commands.get(inr.commandName);
  if (!command) return;

  try {
    await command.execute(client, inr);
  } catch (e) {
    console.error(`[ERROR] Error when executing ${inr.commandName}: ${e}`);
  }
});

client.login(TOKEN);