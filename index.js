const {
  REST,
  Routes,
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
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
const pCommands = [];
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;
const rest = new REST({ version: '10' }).setToken(TOKEN);
const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const privcFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));

files.forEach(file => {
  const command = require(`./commands/${file}`);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON())
  } else {
    console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
  }
});

privcFiles.forEach(file => {
  const command = require(`./commands/admin/${file}`);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    pCommands.push(command.data.toJSON())
  } else {
    console.log(`[WARNING] The private command at ${file} is missing a required "data" or "execute" property.`);
  }
});

(async()=>{
  try {
    console.log(`Started refreshing ${commands.length + pCommands.length} application (/) commands} application (/) commands.`);
    const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: commands },
		);
    const data2 = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: pCommands },
		);
    console.log(`Successfully reloaded ${data.length} public application (/) commands.`);
    console.log(`Successfully reloaded ${data2.length} private application (/) commands.`);
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

app.get('/', (req, res) => res.send('Server made to keep bot running 24/7.'));
app.listen(port, () => console.log(`Server running on port ${port}`));

client.login(TOKEN);