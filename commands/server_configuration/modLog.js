/**
 * @file modLog command
 * @author Kara
 * @license GPL-3.0
 */

// This feature is absolutely useless because Discord already has audit logs. I'll probably remove this in future.

exports.exec = async (Bastion, message) => {
  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'moderationLog' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, modLogStats;
  if (guildModel.dataValues.moderationLog) {
    await Bastion.database.models.guild.update({
      moderationLog: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'moderationLog' ]
    });
    color = Bastion.colors.RED;
    modLogStats = Bastion.i18n.info(message.guild.language, 'disableModerationLog', message.author.tag);
  }
  else {
    await Bastion.database.models.guild.update({
      moderationLog: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'moderationLog' ]
    });
    color = Bastion.colors.GREEN;
    modLogStats = Bastion.i18n.info(message.guild.language, 'enableModerationLog', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: modLogStats
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'modLog',
  description: 'Toggles logging of various moderation events in the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'modLog',
  example: []
};
