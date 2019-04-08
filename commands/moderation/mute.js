/**
 * @file mute command
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

  await member.setMute(true);

  args.reason = args.reason.join(' ');

  await message.channel.send({
    embed: {
      color: Kara.colors.ORANGE,
      description: Kara.i18n.info(message.guild.language, 'voiceMute', message.author.tag, user.tag, args.reason)
    }
  }).catch(e => {
    Kara.log.error(e);
  });

  Kara.emit('moderationLog', message, this.help.name, user, args.reason);
};

exports.config = {
  aliases: [ 'm' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'mute',
  description: 'Mutes a specified user server-wide in your Discord server.',
  botPermission: 'MUTE_MEMBERS',
  userTextPermission: 'MUTE_MEMBERS',
  userVoicePermission: '',
  usage: 'mute <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'mute @user#001 -r Shouting like crazy', 'mute 167147569575323761 -r Singing like a broken radio' ]
};
