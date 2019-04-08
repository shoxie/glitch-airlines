/**
 * @file filterWord command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'filterWords' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, filterWordStats;
  if (guildModel.dataValues.filterWords) {
    await Kara.database.models.guild.update({
      filterWords: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterWords' ]
    });
    color = Kara.colors.RED;
    filterWordStats = Kara.i18n.info(message.guild.language, 'disableWordFilter', message.author.tag);
  }
  else {
    await Kara.database.models.guild.update({
      filterWords: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterWords' ]
    });
    color = Kara.colors.GREEN;
    filterWordStats = Kara.i18n.info(message.guild.language, 'enableWordFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: filterWordStats
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
  name: 'filterWord',
  description: 'Toggles automatic deletion of messages that contains any word that is being filtered.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterWord',
  example: []
};
