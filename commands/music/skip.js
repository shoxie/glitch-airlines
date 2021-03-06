/**
 * @file skip command
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

  if (!Kara.credentials.ownerId.includes(message.author.id) && !message.member.roles.has(message.guild.music.musicMasterRole)) {
    if (!message.guild.music.skipVotes.includes(message.author.id)) {
      message.guild.music.skipVotes.push(message.author.id);
    }

    if (message.guild.music.skipVotes.length >= parseInt((message.guild.voiceConnection.channel.members.size - 1) / 2)) {
      await message.guild.music.dispatcher.end();

      await message.guild.music.textChannel.send({
        embed: {
          color: Kara.colors.GREEN,
          description: 'Skipping current song.'
        }
      }).catch(e => {
        Kara.log.error(e);
      });
    }
    else {
      await message.guild.music.textChannel.send({
        embed: {
          description: `${parseInt((message.guild.voiceConnection.channel.members.size - 1) / 2) - message.guild.music.skipVotes.length} votes required to skip the current song.`
        }
      }).catch(e => {
        Kara.log.error(e);
      });
    }
  }
  else {
    await message.guild.music.dispatcher.end();

    await message.guild.music.textChannel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: 'Skipping current song.'
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'skip',
  description: 'Skips the currently playing song, in your Discord server, and moves to the next one in the queue.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'skip',
  example: []
};
