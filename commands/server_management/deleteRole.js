/**
 * @file deleteRole command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.mention && !args.id && !args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    if (args.id) {
      role = message.guild.roles.get(args.id);
    }
    else if (args.name) {
      role = message.guild.roles.find(role => role.name === args.name.join(' '));
    }
  }

  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Kara.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  await role.delete();

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: Kara.i18n.info(message.guild.language, 'deleteRole', message.author.tag, role.name)
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deleter' ],
  enabled: true,
  argsDefinitions: [
    { name: 'mention', type: String, alias: 'm', multiple: true, defaultOption: true },
    { name: 'id', type: String, alias: 'i' },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'deleteRole',
  description: 'Deletes the specified role from your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'deleteRole < [-m] @Role Mention | -i ROLE_ID | -n Role Name >',
  example: [ 'deleteRole -m @Server Staffs', 'deleteRole -i 295982817647788032', 'deleteRole -n Server Staffs' ]
};
