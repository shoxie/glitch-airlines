/**
 * @file iAmNot command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.length < 1) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'selfAssignableRoles' ],
    where: {
      guildID: message.guild.id
    }
  });
  if (!guildModel || !guildModel.dataValues.selfAssignableRoles) return;

  let role = message.guild.roles.find(role => role.name === args.join(' '));
  if (!role) return;

  let selfAssignableRoles = [];
  if (guildModel.dataValues.selfAssignableRoles) {
    selfAssignableRoles = guildModel.dataValues.selfAssignableRoles;
  }
  if (!selfAssignableRoles.includes(role.id)) return;

  if (message.guild.me.highestRole.comparePositionTo(role) <= 0) return Kara.log.info('I don\'t have permission to use this command on that role.');

  let member = message.member;
  if (!member) {
    member = await Kara.utils.fetchMember(message.guild, message.author.id);
  }

  await member.removeRole(role);

  message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: Kara.i18n.info(message.guild.language, 'selfRemoveRole', message.author.tag, role.name)
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'idontwant', 'idonthave' ],
  enabled: true
};

exports.help = {
  name: 'iAmNot',
  description: 'Revoke the specified self-assignable role to the user.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'iAmNot <role name>',
  example: [ 'iAmNot Looking to play' ]
};
