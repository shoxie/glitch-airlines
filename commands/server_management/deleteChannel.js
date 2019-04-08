/**
 * @file deleteChannel command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let channel = message.mentions.channels.first();
  if (!channel) {
    channel = message.channel;
    if (args.id) {
      channel = message.guild.channels.get(args.id);
    }
    else if (args.name) {
      channel = message.guild.channels.find(channel => channel.name === args.name.join(' '));
    }
    if (!channel) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'channelNotFound'), message.channel);
    }
  }

  if (!channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
    return Kara.emit('userMissingPermissions', this.help.userTextPermission);
  }
  if (!channel.permissionsFor(message.guild.me).has(this.help.botPermission)) {
    return Kara.emit('bastionMissingPermissions', this.help.botPermission, message);
  }

  await channel.delete();

  if (channel.id === message.channel.id) return;

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: Kara.i18n.info(message.guild.language, 'deleteChannel', message.author.tag, channel.type, channel.name)
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deletec' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deleteChannel',
  description: 'Deletes the specified text or voice channel from your Discord server.',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'deleteChannel [ [-m] #channel-mention | -i CHANNEL_ID | -n Channel Name ]',
  example: [ 'deleteChannel -m #channel-name', 'deleteChannel -i 298889698368028672', 'deleteChannel -n Control Room' ]
};
