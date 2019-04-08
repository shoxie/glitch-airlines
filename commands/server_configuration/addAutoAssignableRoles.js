/**
 * @file addAutoAssignableRoles command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  for (let i = 0; i < args.length; i++) {
    if (!(parseInt(args[i]) < 9223372036854775807)) {
      args.splice(args.indexOf(args[i]), 1);
    }
  }
  args = args.filter(r => message.guild.roles.get(r));
  if (!args.length) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'autoAssignableRoles' ],
    where: {
      guildID: message.guild.id
    }
  });

  let roles = [];
  if (guildModel.dataValues.autoAssignableRoles) {
    roles = guildModel.dataValues.autoAssignableRoles;
  }
  roles = roles.concat(args);
  roles = roles.filter(r => message.guild.roles.get(r));
  roles = [ ...new Set(roles) ];

  await Kara.database.models.guild.update({
    autoAssignableRoles: roles
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'autoAssignableRoles' ]
  });

  let roleNames = [];
  for (let i = 0; i < args.length; i++) {
    roleNames.push(message.guild.roles.get(args[i]).name);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'Added auto assignable roles',
      description: roleNames.join(', ')
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'aaar' ],
  enabled: true
};

exports.help = {
  name: 'addAutoAssignableRoles',
  description: 'Adds specified roles to the list of auto-assignable roles, anyone who joins the server gets these roles automatically.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addAutoAssignableRoles <RoleID> [RoleID] [RoleID]',
  example: [ 'addAutoAssignableRoles 443322110055998877 778899550011223344' ]
};
