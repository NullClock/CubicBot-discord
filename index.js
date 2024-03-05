import {
  REST,
  Routes,
  Client,
  GatewayIntentBits
} from 'discord.js';
import {
  createRequire
} from 'module';
import { 
  DiscordInteractions
} from "slash-commands";
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

const disint = new DiscordInteractions({
  applicationId: process.env.CLIENT_ID,
  authToken: process.env.TOKEN,
  publicKey: process.env.PUB_KEY,
});

client.on('ready', () => {
  console.log(`${client.user.tag} is alive!`);
});

const commands = [];
const commandDatas = [];
const pCommands = [];
const pCommandDatas = [];

await fs.readdir('./commands/', (err, files) => {
  if (err) throw new Error('Error while loading bot commands: ' + err);

  files.forEach(file => {
    if (file.endsWith('.p.cjs')) {
      const pCommand = require(`./commands/${file}`);
      pCommands.push(pCommand);
      pCommandDatas.push(pCommand.data.toJSON());
      return;
    } else if (file.endsWith('.c.cjs')) {
      const command = require(`./commands/${file}`);
      commands.push(command);
      commandDatas.push(command.data.toJSON());
      return;
    } else {
      return;
    }

    setTimeout(async () => {
      for (const command of commandDatas) {
        await disint
          .createApplicationCommand(command);
        console.log("[COMMAND REGISTERED] /" + command.name);
      }

      for (const command of pCommandDatas) {
        await await interaction
          .createApplicationCommand(command, '1201312485542723616');
        console.log("[PRIVATE COMMAND REGISTERED] /" + command.name + " in guild " + GUILD_ID);
      }
    }, 1500);
  });
});

// const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '1201312485542723616';

// (async()=>{
//   try {
//     console.log('Started refreshing application (/) commands.');
//     await rest.put(
//       Routes.applicationCommands(CLIENT_ID),
//       { body: commandDatas }
//     );
//     await rest.put(
//       Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
//       { body: pCommandDatas }
//     );
//     console.log('Successfully reloaded application (/) commands.');
//   } catch (error) {
//     console.error(error);
//   }
// })();

client.on('interactionCreate', async inr => {
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

  pCommands.forEach(async command => {
    if (inr.name == command.name && pi != pCommands.length - 1) {
      await command.code(client, inr);
      pi++;
    } else if (pi == pCommands.length - 1) {
      pi = 0;
      return;
    }
  });
});

client.login(process.env.TOKEN);