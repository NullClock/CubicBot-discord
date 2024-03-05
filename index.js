import {
  REST,
  Routes,
  Client,
  GatewayIntentBits
} from 'discord.js';
import {
  createRequire
} from 'module';
import fs from 'fs';
import 'dotenv/config'

const require = createRequire(import.meta.url);

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

const commands = [];
const commandDatas = [];

await fs.readdir('./commands/', (err, files) => {
  if (err) throw new Error('Error while loading bot commands: ' + err);

  files.forEach(file => {
    const command = require(`./commands/${file}`);
    commands.push(command);
    commandDatas.push(command.data.toJSON());
    return;
  });
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '1201312485542723616';

(async()=>{
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commandDatas }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async (inr) => {
  if (!inr.isChatInputCommand()) return;
  let i = 0;
  let pi = 0;

  commands.forEach(async command => {
    if (inr.name == command.name && i != commands.length - 1) {
      await command.code(client, inr);
      i++
    } else if (i == commands.length - 1) {
      i = 0;
      return;
    }
  });
});

client.login(process.env.TOKEN);