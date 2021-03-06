/**
 * @file clear command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  await message.delete().catch(() => {});


  args.amount = Math.abs(args.amount);
  let messages = await message.channel.fetchMessages({
    limit: args.amount && args.amount < 100 ? args.amount : 100
  });

  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }


  if (user) {
    messages = messages.filter(message => message.author.id === user.id);
  }
  else if (args.user) {
    messages = messages.filter(message => message.author.id === args.user);
  }
  else if (args.bots) {
    messages = messages.filter(message => message.author.bot);
  }
  if (args.nonpinned) {
    messages = messages.filter(message => !message.pinned);
  }
  if (args.time) {
    let requiredTimestamp = message.createdTimestamp - (args.time * 60 * 1000);
    messages = messages.filter(message => message.createdTimestamp >= requiredTimestamp);
  }


  let clearedMessages = await message.channel.bulkDelete(messages, true);
  if (!clearedMessages.size) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'noDeletableMessage'), message.channel);
  }


  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: `I've cleared ${clearedMessages.size}${args.nonpinned ? ' non pinned' : ''} messages from ${user ? user : args.bots ? 'BOTs' : 'everyone'}${args.time ? ` sent in the past ${args.time} minutes` : ''}.`
    }
  }).then(msg => {
    msg.delete(10000).catch(() => {});
  }).catch(e => {
    Kara.log.error(e);
  });


  let reason = 'No reason given';
  Kara.emit('moderationLog', message, this.help.name, message.channel, reason, {
    cleared: `${clearedMessages.size}${args.nonpinned ? ' non pinned' : ''} messages from ${user ? user : args.bots ? 'BOTs' : 'everyone'}${args.time ? ` sent in the past ${args.time} minutes.` : ''}`
  });
};

exports.config = {
  aliases: [ 'clr', 'purge' ],
  enabled: true,
  argsDefinitions: [
    { name: 'amount', type: Number, alias: 'n', defaultValue: 100, defaultOption: true },
    { name: 'user', type: String, alias: 'u' },
    { name: 'bots', type: Boolean },
    { name: 'nonpinned', type: Boolean },
    { name: 'time', type: Number, alias: 't' }
  ]
};

exports.help = {
  name: 'clear',
  description: 'Deletes a bulk of specified messages from a text channel of your Discord server.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'clear [NUMBER_OF_MESSAGES] [--nonpinned] [--bots] [@USER-MENTION | --user USER_ID] [--time TIMESPAN_IN_MINUTES]',
  example: [ 'clear', 'clear 43', 'clear --time 3', 'clear 42 --user 188017158542327869', 'clear 13 @Barry#0001', 'clear 37 --bots', 'clear --nonpinned' ]
};