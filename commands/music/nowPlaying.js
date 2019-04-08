/**
 * @file nowPlaying command
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

  await message.guild.music.textChannel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: message.guild.music.dispatcher.paused ? 'Paused' : 'Now Playing',
      url: message.guild.music.songs[0].id ? `https://youtu.be/${message.guild.music.songs[0].id}` : '',
      description: message.guild.music.songs[0].title,
      thumbnail: {
        url: message.guild.music.songs[0].thumbnail
      },
      footer: {
        text: `🔉 ${message.guild.music.dispatcher.volume * 50}% • ${Math.floor(message.guild.music.dispatcher.time / 60000)}:${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000) < 10 ? `0${Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)}` : Math.floor((message.guild.music.dispatcher.time % 60000) / 1000)} / ${message.guild.music.songs[0].duration}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'np' ],
  enabled: true
};

exports.help = {
  name: 'nowPlaying',
  description: 'Shows details of the song currently being played, by %bastion%, in your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'nowPlaying',
  example: []
};
