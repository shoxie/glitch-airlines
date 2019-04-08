/**
 * @file clearWarn command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await Kara.fetchUser(args.id);
  }
  if (!user) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let member = await Kara.utils.fetchMember(message.guild, user.id);
  if (message.author.id !== message.guild.ownerID && message.member.highestRole.comparePositionTo(member.highestRole) <= 0) return Kara.log.info(Kara.i18n.error(message.guild.language, 'lowerRole'));


  await message.client.database.models.guildMember.update({
    warnings: null
  },
  {
    where: {
      userID: member.id,
      guildID: message.guild.id
    },
    fields: [ 'warnings' ]
  });


  args.reason = args.reason.join(' ');

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: Kara.i18n.info(message.guild.language, 'clearWarn', message.author.tag, user.tag, args.reason)
    }
  }).catch(e => {
    Kara.log.error(e);
  });

  Kara.emit('moderationLog', message, this.help.name, user, args.reason);
};

exports.config = {
  aliases: [ 'warnClear' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'clearWarn',
  description: 'Clears all warnings from the given user.',
  botPermission: '',
  userTextPermission: 'KICK_MEMBERS',
  userVoicePermission: '',
  usage: 'clearWarn <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'clearWarn @user#001 -r Apologized', 'clearWarn 167147569575323761 -r Forgiven' ]
};
