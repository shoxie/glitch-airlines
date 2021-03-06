/**
 * @file reminder command
 * @author Kara
 * @license GPL-3.0
 */

const moment = xrequire('moment');
const remindUsers = {};

exports.exec = async (Kara, message, args) => {
  if (args.cancel) {
    Kara.clearTimeout(remindUsers[message.author.id]);
    delete remindUsers[message.author.id];

    return await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: Kara.i18n.info(message.guild.language, 'deleteReminder', message.author.tag)
      }
    });
  }

  if (!args.duration || !args.message) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let duration = moment.duration(`PT${args.duration.toUpperCase()}`).asMilliseconds(),
    maxDelay = 24 * 60 * 60 * 1000, minDelay = 60 * 1000;

  if (duration > maxDelay || duration < minDelay) {
    return Kara.emit('commandUsage', message, this.help);
  }

  if (remindUsers.hasOwnProperty(message.author.id)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'isReminderInUse', 'reminder --cancel'), message.channel);
  }

  remindUsers[message.author.id] = Kara.setTimeout(async () => {
    let authorDMChannel = await message.author.createDM();
    await authorDMChannel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: 'Reminder',
        description: args.message.join(' '),
        timestamp: new Date()
      }
    });

    delete remindUsers[message.author.id];
  }, duration);

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'Reminder Set',
      description: Kara.i18n.info(message.guild.language, 'addReminder', message.author.tag, args.message.join(' '), moment.duration(duration).humanize())
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'remind' ],
  enabled: true,
  argsDefinitions: [
    { name: 'message', type: String, alias: 'm', multiple: true, defaultOption: true },
    { name: 'duration', type: String, alias: 'd' },
    { name: 'cancel', type: Boolean, alias: 'c' }
  ]
};

exports.help = {
  name: 'reminder',
  description: 'Kara sets a reminder to remind you of specified message, via direct message, after a specified duration.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reminder <-d Duration> <Message>',
  example: [ 'reminder -d 10m30s Get back to work.' ]
};
