/**
 * @file removeSong command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
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

  if (!args.index) {
    return Kara.emit('commandUsage', message, this.help);
  }

  if (args.index >= message.guild.music.songs.length || args.index < 1) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'indexRange'), message.channel);
  }

  let removedSong = message.guild.music.songs.splice(args.index, 1);
  removedSong = removedSong[0];

  await message.guild.music.textChannel.send({
    embed: {
      color: Kara.colors.RED,
      title: 'Removed from the queue',
      url: removedSong.id ? `https://youtu.be/${removedSong.id}` : '',
      description: removedSong.title,
      thumbnail: {
        url: removedSong.thumbnail
      },
      footer: {
        text: `Position: ${args.index} • Requester: ${removedSong.requester}`
      }
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'index', type: Number, defaultOption: true }
  ],
  musicMasterOnly: true
};

exports.help = {
  name: 'removeSong',
  description: 'Removes a song from the current music queue by its position number.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'removeSong [index]',
  example: [ 'removeSong 3' ]
};
