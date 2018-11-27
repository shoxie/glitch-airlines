/**
 * @file The starting point of Bastion
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Discord = require('discord.js');
const BASTION = new Discord.Client({
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

if (BASTION.shard) {
  process.title = `Bastion-Shard-${BASTION.shard.id}`;
}
else {
  process.title = 'Kara';
}

BASTION.package = require('./package.json');
BASTION.credentials = require('./settings/credentials.json');
BASTION.config = require('./settings/config.json');
BASTION.Constants = Discord.Constants;
BASTION.colors = Discord.Constants.Colors;
BASTION.permissions = Discord.Permissions.FLAGS;

// require('./utils/Array.prototype');
require('./utils/String.prototype');
require('./utils/Number.prototype');

const WebhookHandler = require('./handlers/webhookHandler.js');
BASTION.webhook = new WebhookHandler(BASTION.credentials.webhooks);
BASTION.log = require('./handlers/logHandler');
BASTION.functions = require('./handlers/functionHandler');
const LanguageHandler = require('./handlers/languageHandler');
BASTION.strings = new LanguageHandler();
BASTION.db = require('sqlite');
BASTION.db.open('./data/Bastion.sqlite').then(db => {
  db.run('PRAGMA foreign_keys = ON');
  require('./utils/populateDatabase')(BASTION.db);
});

require('./handlers/eventHandler')(BASTION);

const Modules = require('./handlers/moduleHandler');
BASTION.commands = Modules.commands;
BASTION.aliases = Modules.aliases;

BASTION.login(BASTION.credentials.token).catch(e => {
  BASTION.log.error(e.toString());
  process.exit(1);
});

process.on('unhandledRejection', rejection => {
  // eslint-disable-next-line no-console
  console.warn(`\n[unhandledRejection]\n${rejection}\n[/unhandledRejection]\n`);
});

BASTION.on('message', message => {
  let mg9 = ['g9', 'goodnight', 'gudnite'];
  let sender = message.author;
  if(message.content === `g9`) {
    
    message.channel.send(`Goodnight ${sender}`);
    message.author.send('Nite!')
  }
});

BASTION.on('guildMemberAdd', member => {
  const serverStats = {
      guildID: '335604901730058243',
      totalUsersID:'494362571621662721',
      memberCountID:'494362595994632204',
      botCountID:'494362634641080330'
    }
    if (member.guild.id !== serverStats.guildID) return;
    
    BASTION.channels.get(serverStats.totalUsersID).setName(`Total User : ${member.guild.memberCount}`);
    BASTION.channels.get(serverStats.memberCountID).setName(`Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`);
    BASTION.channels.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`);
});
BASTION.on('guildMemberRemove', member => {
  const serverStats = {
      guildID: '335604901730058243',
      totalUsersID:'494362571621662721',
      memberCountID:'494362595994632204',
      botCountID:'494362634641080330'
    }
    if (member.guild.id !== serverStats.guildID) return;
    
    BASTION.channels.get(serverStats.totalUsersID).setName(`Total User : ${member.guild.memberCount}`);
    BASTION.channels.get(serverStats.memberCountID).setName(`Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`);
    BASTION.channels.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`);
});
function module4() {
  console.log('botkate started doing its job!');

 // setInterval(function () {
   // console.log(('botkate timer:' + new Date().getTime()).red);
 // }, 99999);
}

module.exports = module4;