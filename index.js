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

  await fs.readdir('./commands/', (err, files) => {
    if (err) throw new Error('Error while loading bot commands: ' + err);

    files.forEach(file => {
      if (!file.endsWith('.js')) return;

      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    });
  });

  const rest = new REST({ version: '10' }).setToken('MTE4MTkxODkyMzQ3NDYxMjI5Ng.G6ZddF.8shwM7RAAy5OrHr4FZ6SkswiZM3yCfxAA02Ask');

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  client.on('interactionCreate', async inr => {
    if (!inr.isChatInputCommand()) return;
    
    
  });

  client.login('MTE4MTkxODkyMzQ3NDYxMjI5Ng.G6ZddF.8shwM7RAAy5OrHr4FZ6SkswiZM3yCfxAA02Ask');
})();