/**
 * @file resetModerationLogs command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  await Bastion.database.models.guild.update({
    moderationCaseNo: 1
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'moderationCaseNo' ]
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: Bastion.i18n.info(message.guild.language, 'resetModerationLogCases', message.author.tag)
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'resetModLogs' ],
  enabled: true
};

exports.help = {
  name: 'resetModerationLogs',
  description: 'Resets the moderation log cases back to 1.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'resetModerationLogs',
  example: []
};
