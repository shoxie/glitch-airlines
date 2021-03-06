/**
 * @file membersOnly command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'membersOnly' ],
    where: {
      guildID: message.guild.id
    }
  });

  await Bastion.database.models.guild.update({
    membersOnly: !guildModel.dataValues.membersOnly
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'membersOnly' ]
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors[guildModel.dataValues.membersOnly ? 'RED' : 'GREEN'],
      description: Bastion.i18n.info(message.guild.language, guildModel.dataValues.membersOnly ? 'disableMembersOnly' : 'enableMembersOnly', message.author.tag)
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
  name: 'membersOnly',
  description: 'Toggles Members Only mode of Bastion. If Members Only mode is enabled only users with at least one role in the server can use Kara\'s Commands.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'membersOnly',
  example: []
};
