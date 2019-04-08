/**
 * @file removeRole command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let user = message.mentions.users.first();
  let role;
  if (!user) {
    user = message.author;
    role = args.join(' ');
  }
  else {
    role = args.slice(1).join(' ');
  }
  role = message.guild.roles.find(role => role.name === role);
  if (role && message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(role) <= 0) return Kara.log.info(Kara.i18n.error(message.guild.language, 'lowerRole'));
  else if (!role) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }

  let member = await Kara.utils.fetchMember(message.guild, user.id);
  await member.removeRole(role);

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: Kara.i18n.info(message.guild.language, 'removeRole', message.author.tag, role.name, user.tag)
    }
  }).catch(e => {
    Kara.log.error(e);
  });

  let reason = 'No reason given';

  Kara.emit('moderationLog', message, this.help.name, user, reason, {
    role: role
  });
};

exports.config = {
  aliases: [ 'remover' ],
  enabled: true
};

exports.help = {
  name: 'removeRole',
  description: 'Removes the specified role from a specified user of your Discord server.',
  botPermission: 'MANAGE_ROLES',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'removeRole [@user-mention] <Role Name>',
  example: [ 'removeRole @user#0001 Role Name', 'removeRole Role Name' ]
};
