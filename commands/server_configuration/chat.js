/**
 * @file chat command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'chat' ],
    where: {
      guildID: message.guild.id
    }
  });

  let color, chatStats;
  if (guildModel.dataValues.chat) {
    await Kara.database.models.guild.update({
      chat: false
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'chat' ]
    });
    color = Kara.colors.RED;
    chatStats = Kara.i18n.info(message.guild.language, 'disableChat', message.author.tag);
  }
  else {
    await Kara.database.models.guild.update({
      chat: true
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'chat' ]
    });
    color = Kara.colors.GREEN;
    chatStats = Kara.i18n.info(message.guild.language, 'enableChat', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: chatStats
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
  name: 'chat',
  description: 'Toggles %bastion%\'s chatting module.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'chat',
  example: []
};
