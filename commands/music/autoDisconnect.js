/**
 * @file autoDisconnect command
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

  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'musicAutoDisconnect' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, autoDisconnectStatus;
  if (guildModel.dataValues.musicAutoDisconnect) {
    enabled = false;
    color = Kara.colors.RED;
    autoDisconnectStatus = Kara.i18n.info(message.guild.language, 'disableMusicAutoDisconnect', message.author.tag);
  }
  else {
    enabled = true;
    color = Kara.colors.GREEN;
    autoDisconnectStatus = Kara.i18n.info(message.guild.language, 'enableMusicAutoDisconnect', message.author.tag);
  }

  await Kara.database.models.guild.update({
    musicAutoDisconnect: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'musicAutoDisconnect' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: autoDisconnectStatus
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'autoDisconnect',
  description: 'Toggles auto disconnect from voice channel. If enabled, Kara will automatically leave the voice channel to save bandwidth when no one else is connected to it.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'autoDisconnect',
  example: []
};
