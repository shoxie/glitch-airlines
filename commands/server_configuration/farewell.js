/**
 * @file farewell command
 * @author Kara
 * @license GPL-3.0
 */
// I don't understand why this is even needed, but some fellows like this.

exports.exec = async (Kara, message) => {
  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'farewell' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, farewellStats;
  if (guildModel.dataValues.farewell === message.channel.id) {
    await Kara.database.models.guild.update({
      farewell: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'farewell' ]
    });
    color = Kara.colors.RED;
    farewellStats = Kara.i18n.info(message.guild.language, 'disableFarewellMessages', message.author.tag);
  }
  else {
    await Kara.database.models.guild.update({
      farewell: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'farewell' ]
    });
    color = Kara.colors.GREEN;
    farewellStats = Kara.i18n.info(message.guild.language, 'enableFarewellMessages', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: farewellStats
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
  name: 'farewell',
  description: 'Toggles sending of farewell message for members who left the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'farewell',
  example: []
};
