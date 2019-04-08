/**
 * @file filterInvite command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'filterInvites' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, filterInviteStats;
  if (guildModel.dataValues.filterInvites) {
    await Kara.database.models.guild.update({
      filterInvites: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterInvites' ]
    });
    color = Kara.colors.RED;
    filterInviteStats = Kara.i18n.info(message.guild.language, 'disableInviteFilter', message.author.tag);
  }
  else {
    await Kara.database.models.guild.update({
      filterInvites: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterInvites' ]
    });
    color = Kara.colors.GREEN;
    filterInviteStats = Kara.i18n.info(message.guild.language, 'enableInviteFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: filterInviteStats
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'filterinv' ],
  enabled: true
};

exports.help = {
  name: 'filterInvite',
  description: 'Toggles automatic deleting of Discord server invites posted in the server.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterInvite',
  example: []
};
