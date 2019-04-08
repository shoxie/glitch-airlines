/**
 * @file roleColor command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.name || !args.color) {
    return Kara.emit('commandUsage', message, this.help);
  }

  args.color = args.color.join('_').toUpperCase();
  let colors = [
    'DEFAULT',
    'AQUA',
    'GREEN',
    'BLUE',
    'PURPLE',
    'GOLD',
    'ORANGE',
    'RED',
    'GREY',
    'DARKER_GREY',
    'NAVY',
    'DARK_AQUA',
    'DARK_GREEN',
    'DARK_BLUE',
    'DARK_PURPLE',
    'DARK_GOLD',
    'DARK_ORANGE',
    'DARK_RED',
    'DARK_GREY',
    'LIGHT_GREY',
    'DARK_NAVY',
    'RANDOM'
  ];
  if (!colors.includes(args.color)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'invalidRoleColor', colors.join(', ').replace(/_/g, ' ').toTitleCase()), message.channel);
  }

  args.name = args.name.join(' ');

  let role = message.guild.roles.find(role => role.name === args.name);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Kara.log.info('User doesn\'t have permission to use this command on that role.');
  else if (!role) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  await role.setColor(args.color);

  await message.channel.send({
    embed: {
      color: role.color,
      description: Kara.i18n.info(message.guild.language, 'updateRoleColor', message.author.tag, role.name, args.color.toTitleCase())
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'roleColour' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'color', type: String, multiple:true, alias: 'c' }
  ]
};

exports.help = {
  name: 'roleColor',
  description: 'Changes the color of the specified role of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'roleColor <ROLE_NAME> <-c COLOR>',
  example: [ 'roleColor Server Staffs -c Dark Orange', 'roleColor Legendary Heroes -c Random' ]
};
