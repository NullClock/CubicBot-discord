(async () => {
  const { 
    Client, 
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes
  } = require('discord.js');
  const fs = require('fs');

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMembers
    ]
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
      if (file.endsWith('.js')) {
        const command = require(`./commands/${file}`);
        commands.push(command);
        commandDatas.push(command.data.toJSON());
      } else if (file.endsWith('.p.js')) {
        const pCommand = require(`./commands/${file}`);
        pCommands.push(pCommand);
        pCommandDatas.push(pCommand.data.toJSON());
      } else {
        return;
      }
    });
  });

  const rest = new REST().setToken('MTE4MTkxODkyMzQ3NDYxMjI5Ng.G6ZddF.8shwM7RAAy5OrHr4FZ6SkswiZM3yCfxAA02Ask');
  const CLIENT_ID = '1181918923474612296';
  const GUILD_ID = '1201312485542723616';

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commandDatas }
    );
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: pCommandDatas }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  client.on('interactionCreate', async inr => {
    if (!inr.isChatInputCommand()) return;
    
    commands.forEach(command => {
      if (inr.name == command.name) {
        await command.code(client, inr);
      }
    });
  });

  client.login('MTE4MTkxODkyMzQ3NDYxMjI5Ng.G6ZddF.8shwM7RAAy5OrHr4FZ6SkswiZM3yCfxAA02Ask');
})();