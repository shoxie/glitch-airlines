/**
 * @file disconnect command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  if (!message.guild.music.enabled) {
    if (Kara.user.id === '267035345537728512') {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'musicDisabledPublic'), message.channel);
    }
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'musicDisabled'), message.channel);
  }

  message.guild.music.songs = [];

  if (message.guild.music.dispatcher) {
    message.guild.music.dispatcher.end();
  }

  if (message.guild.voiceConnection) {
    message.guild.voiceConnection.disconnect();
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: 'Disconnected from the voice connection of this server.'
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  musicMasterOnly: true
};

exports.help = {
  name: 'disconnect',
  description: 'Disconnect Kara from any voice connection in the Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'disconnect',
  example: []
};
