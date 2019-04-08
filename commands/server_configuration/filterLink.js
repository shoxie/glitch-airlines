/**
 * @file filterLink command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'filterLinks' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, filterLinkStats;
  if (guildModel.dataValues.filterLinks) {
    await Kara.database.models.guild.update({
      filterLinks: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterLinks' ]
    });
    color = Kara.colors.RED;
    filterLinkStats = Kara.i18n.info(message.guild.language, 'disableLinkFilter', message.author.tag);
  }
  else {
    await Kara.database.models.guild.update({
      filterLinks: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterLinks' ]
    });
    color = Kara.colors.GREEN;
    filterLinkStats = Kara.i18n.info(message.guild.language, 'enableLinkFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: filterLinkStats
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
  name: 'filterLink',
  description: 'Toggles automatic deletion of any links posted in the server.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterLink',
  example: []
};
