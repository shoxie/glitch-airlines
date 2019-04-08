/**
 * @file softBan command
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

  if (!member.bannable) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'noPermission', 'soft-ban', user), message.channel);
  }

  args.reason = args.reason.join(' ');

  await member.ban({
    days: 7,
    reason: args.reason
  });

  await message.guild.unban(user.id).catch(e => {
    Kara.log.error(e);
    message.channel.send({
      embed: {
        color: Kara.colors.RED,
        title: 'Soft-Ban Error',
        description: 'Banned but unable to unban. Please unban the following user.',
        fields: [
          {
            name: 'User',
            value: user.tag,
            inline: true
          },
          {
            name: 'ID',
            value: user.id,
            inline: true
          }
        ]
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: Kara.i18n.info(message.guild.language, 'softBan', message.author.tag, user.tag, args.reason),
      footer: {
        text: `ID ${user.id}`
      }
    }
  }).catch(e => {
    Kara.log.error(e);
  });

  Kara.emit('moderationLog', message, this.help.name, user, args.reason);

  let DMChannel = await user.createDM();
  await DMChannel.send({
    embed: {
      color: Kara.colors.RED,
      description: Kara.i18n.info(message.guild.language, 'softBanDM', message.author.tag, message.guild.name, args.reason)
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'sb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', alias: 'r', type: String, multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'softBan',
  description: 'Bans & unbans the specified user, immediately, from your Discord server and removes 7 days of their message history.',
  botPermission: 'BAN_MEMBERS',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'softBan <@USER_MENTION | USER_ID> -r [Reason]',
  example: [ 'softBan @user#001 -r Spamming in support channel.', 'softBan 167147569575323761 -r Reputed spammer.' ]
};
