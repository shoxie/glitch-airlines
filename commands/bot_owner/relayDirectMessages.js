/**
 * @file relayDirectMessages command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let settingsModel = await Kara.database.models.settings.findOne({
    attributes: [ 'relayDirectMessages' ],
    where: {
      botID: Kara.user.id
    }
  });

  await Kara.database.models.settings.update({
    relayDirectMessages: !settingsModel.dataValues.relayDirectMessages
  },
  {
    where: {
      botID: Kara.user.id
    },
    fields: [ 'relayDirectMessages' ]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors[settingsModel.dataValues.relayDirectMessages ? 'RED' : 'GREEN'],
      description: Kara.i18n.info(message.guild.language, settingsModel.dataValues.relayDirectMessages ? 'disableDirectMessageReyals' : 'enableDirectMessageReyals', message.author.tag)
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'relayPrivateMessages', 'relayDMs', 'relayPMs' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'relayDirectMessages',
  description: 'Toggles relaying of direct messages, sent to Kara, to your inbox.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'relayDirectMessages',
  example: []
};
