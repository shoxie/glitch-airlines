/**
 * @file messageChannel command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.length < 2 || !(parseInt(args[0]) < 9223372036854775807)) {
    return Kara.emit('commandUsage', message, this.help);
  }

  if (Kara.shard) {
    await Kara.shard.broadcastEval(`
      let channel = this.channels.get('${args[0]}');
      if (channel) {
        channel.send({
          embed: {
            color: this.colors.BLUE,
            description: '${args.slice(1).join(' ').replace('\'', '\\\'')}'
          }
        }).catch(this.log.error);
      }
    `);
  }
  else {
    let channel = Kara.channels.get(args[0]);
    if (channel) {
      await channel.send({
        embed: {
          color: Kara.colors.BLUE,
          description: args.slice(1).join(' ')
        }
      });
    }
    else {
      Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'channel'), message.channel);
    }
  }
};

exports.config = {
  aliases: [ 'msgc' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'messageChannel',
  description: 'Send a specified message to any specified text channel that Kara has access to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'messageChannel <channel_id> <message>',
  example: [ 'messageChannel CHANNEL_ID Hello everyone!' ]
};
