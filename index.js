(async()=>{
    // default imports
    const events = require('events');
    const { exec } = require("child_process")
    const logs = require("discord-logs")
    const Discord = require("discord.js")
    const { 
        MessageEmbed, 
        MessageButton, 
        MessageActionRow, 
        Intents, 
        Permissions, 
        MessageSelectMenu 
    }= require("discord.js")
    const fs = require('fs');
    let process = require('process');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // block imports
    let https = require("https")
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
    
    // define s4d components (pretty sure 90% of these arnt even used/required)
    let s4d = {
        Discord,
        fire:null,
        joiningMember:null,
        reply:null,
        player:null,
        manager:null,
        Inviter:null,
        message:null,
        notifer:null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // check if d.js is v13
    if (!require('./package.json').dependencies['discord.js'].startsWith("^13.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord.js'] = '^13.16.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("Seems you arent using v13 please re-run or run `npm i discord.js@13.16.0`");
    }

    // check if discord-logs is v2
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord-logs'] = '^2.0.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("discord-logs must be 2.0.0. please re-run or if that fails run `npm i discord-logs@2.0.0` then re-run");
    }

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION", 
            "CHANNEL"
        ]
    });

    // when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // upon error print "Error!" and the error
    process.on('uncaughtException', function (err) {
        console.log('Error!');
        console.log(err);
    });

    // give the new client to discord-logs
    logs(s4d.client);

    // pre blockly code
    const discordModals = require('discord-modals');
    discordModals(s4d.client);
    const { Modal, TextInputComponent, showModal } = require('discord-modals');

    // blockly code
    await s4d.client.login('MTE4MTkxODkyMzQ3NDYxMjI5Ng.G6ZddF.8shwM7RAAy5OrHr4FZ6SkswiZM3yCfxAA02Ask').catch((e) => {
            const tokenInvalid = true;
            const tokenError = e;
            if (e.toString().toLowerCase().includes("token")) {
                throw new Error("An invalid bot token was provided!")
            } else {
                throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
            }
        });
    
    s4d.client.on('ready', async () => {
      s4d.client.user.setPresence({status: "online",activities:[{name:'to commands',type:"LISTENING"}]});
    
    });
    
    synchronizeSlashCommands(s4d.client, [
      {
          name: 'bot-shutdown',
      		description: '[BOT ADMIN] Shuts down the bot until the bot is manually restarted from the control panel.',
      		options: [
    
          ]
      },
    ],{
        debug: false,
    
    });
    
    s4d.client.on('interactionCreate', async (interaction) => {
              if ((interaction.commandName) == 'bot-shutdown') {
        let bot-shutdown = new Modal()
            .setCustomId('bot-shutdown')
            .setTitle('ADMIN ACTION PASSWORD')
            .addComponents(
          new TextInputComponent()
              .setCustomId('pwdi')
              .setLabel('PASSWORD')
              .setStyle(('SHORT'))
              .setMinLength()
              .setMaxLength()
              .setRequired(true)
              .setPlaceholder('*********'),
        );showModal(bot-shutdown, {
                client: s4d.client,
                interaction: interaction
            })}
    
        });
    
    s4d.client.on('modalSubmit', async (i) => {
    let member = i.guild.members.cache.get(i.member.user.id)
      if (((i.customId)) == 'bot-shutdown') {
        if (((i.getTextInputValue('pwdi'))) == 'roll-a-magic-7!') {
          s4d.client.destroy();
        }
      }
    
    });
    
    return s4d
})();