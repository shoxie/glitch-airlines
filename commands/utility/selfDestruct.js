exports.exec = async (Kara, message, args) => {
  if (!args.content) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let minTimeout = 5, maxTimeout = 600;
  if (!args.timeout.inRange(minTimeout, maxTimeout)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'selfDestructTimeout', minTimeout, maxTimeout), message.channel);
  }

  if (message.content && message.deletable) {
    await message.delete().catch(() => {});
  }

  let secretMessage = await message.channel.send({
    embed: {
      color: Kara.colors.DEFAULT,
      description: args.content.join(' '),
      footer: {
        text: `${Kara.credentials.ownerId.includes(message.author.id) ? '' : Kara.i18n.info(message.guild.language, 'endorsementMessage')}`
      }
    }
  });
  await secretMessage.delete(args.timeout * 1000);
};

exports.config = {
  aliases: [ 'destruct' ],
  enabled: true,
  argsDefinitions: [
    { name: 'content', type: String, alias: 'c', multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 30 }
  ]
};

exports.help = {
  name: 'selfDestruct',
  description: 'Sends the same message that you had sent, but it will get auto deleted after a specific amount of time.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'selfDestruct <content> [-t <seconds>]',
  example: [ 'selfDestruct This will destruct after 30 seconds', 'selfDestruct This will destruct after 10 seconds -t 10' ]
};
