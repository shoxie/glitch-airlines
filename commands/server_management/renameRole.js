/**
 * @file renameRole command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.old || !args.new) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let maxLength = 100;
  args.old = args.old.join(' ');
  args.new = args.new.join(' ');
  if (!args.new.length.inRange(0, maxLength)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNameLength', maxLength), message.channel);
  }

  let role = message.guild.roles.find(role => role.name === args.old);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Kara.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  await role.setName(args.new);

  await message.channel.send({
    embed: {
      color: Kara.colors.ORANGE,
      description: Kara.i18n.info(message.guild.language, 'renameRole', message.author.tag, args.old, args.new),
      footer: {
        text: `ID: ${role.id}`
      }
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'renamer' ],
  enabled: true,
  argsDefinitions: [
    { name: 'old', type: String, alias: 'o', multiple: true },
    { name: 'new', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'renameRole',
  description: 'Renames the specified role of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'renameRole < -o Old Role Name -n New Role Name >',
  example: [ 'renameRole -o Server Staffs -n Legendary Staffs' ]
};
