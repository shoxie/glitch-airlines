/**
 * @file shuffle command
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

  if (message.guild.music.textChannelID && message.guild.music.textChannelID !== message.channel.id) {
    return Kara.log.info('Music channels have been set, so music commands will only work in the Music Text Channel.');
  }

  if (!message.guild.music.songs || !message.guild.music.songs.length) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notPlaying'), message.channel);
  }

  let nowPlaying = message.guild.music.songs.shift();
  message.guild.music.songs = message.guild.music.songs.shuffle();
  message.guild.music.songs.unshift(nowPlaying);

  await message.guild.music.textChannel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: 'Shuffled the queue.'
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
  name: 'shuffle',
  description: 'Shuffles %bastion%\'s entire music queue of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shuffle',
  example: []
};
