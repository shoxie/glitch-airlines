/**
 * @file autoPlay command
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
    attributes: [ 'musicAutoPlay' ],
    where: {
      guildID: message.guild.id
    }
  });

  let enabled, color, autoPlayStatus;
  if (guildModel.dataValues.musicAutoPlay) {
    enabled = false;
    color = Kara.colors.RED;
    autoPlayStatus = Kara.i18n.info(message.guild.language, 'disableMusicAutoPlay', message.author.tag);
  }
  else {
    enabled = true;
    color = Kara.colors.GREEN;
    autoPlayStatus = Kara.i18n.info(message.guild.language, 'enableMusicAutoPlay', message.author.tag);
  }

  await Kara.database.models.guild.update({
    musicAutoPlay: enabled
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'musicAutoPlay' ]
  });

  await message.channel.send({
    embed: {
      color: color,
      description: autoPlayStatus
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
  name: 'autoPlay',
  description: 'Toggles auto playing of music.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'autoPlay',
  example: []
};
