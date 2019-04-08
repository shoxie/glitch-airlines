/**
 * @file airhorn command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  if (message.guild.voiceConnection) {
    if (!message.guild.voiceConnection.channel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      return Kara.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (message.guild.voiceConnection.speaking) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'isSpeaking'), message.channel);
    }

    if (!message.guild.voiceConnection.channel.speakable) {
      return Kara.emit('bastionMissingPermissions', 'SPEAK', message);
    }

    message.guild.voiceConnection.playFile('./assets/airhorn.wav', {
      passes: (Kara.configurations.music && Kara.configurations.music.passes) || 1,
      bitrate: 'auto'
    });
  }
  else if (message.member.voiceChannel) {
    if (!message.member.voiceChannel.permissionsFor(message.member).has(this.help.userTextPermission)) {
      return Kara.emit('userMissingPermissions', this.help.userTextPermission);
    }

    if (!message.member.voiceChannel.joinable) {
      return Kara.emit('bastionMissingPermissions', 'CONNECT', message);
    }

    if (!message.member.voiceChannel.speakable) {
      return Kara.emit('bastionMissingPermissions', 'SPEAK', message);
    }

    let connection = await message.member.voiceChannel.join();

    connection.on('error', Kara.log.error);
    connection.on('failed', Kara.log.error);

    const dispatcher = connection.playFile('./assets/airhorn.wav', {
      passes: (Kara.configurations.music && Kara.configurations.music.passes) || 1,
      bitrate: 'auto'
    });

    dispatcher.on('error', error => {
      Kara.log.error(error);
    });

    dispatcher.on('end', () => {
      connection.channel.leave();
    });
  }
  else {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'eitherOneInVC'), message.channel);
  }
};

exports.config = {
  aliases: [ 'horn' ],
  enabled: true
};

exports.help = {
  name: 'airhorn',
  description: 'Plays an airhorn in a voice channel.',
  botPermission: '',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'airhorn',
  example: []
};
