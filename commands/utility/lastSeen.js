/**
 * @file lastSeen command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let user;
  if (message.mentions.users.size) {
    user = message.mentions.users.first();
  }
  else if (args.id) {
    user = await Kara.utils.fetchMember(message.guild, args.id);
    if (user) {
      user = user.user;
    }
  }
  if (!user) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let color, description;
  if (user.lastMessageID) {
    let lastSeen = Date.now() - user.lastMessage.createdTimestamp;
    let seconds = lastSeen / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    lastSeen = `${seconds}s`;
    if (days) {
      lastSeen = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    else if (hours) {
      lastSeen = `${hours}h ${minutes}m ${seconds}s`;
    }
    else if (minutes) {
      lastSeen = `${minutes}m ${seconds}s`;
    }

    color = Kara.colors.BLUE;
    description = Kara.i18n.info(message.guild.language, 'lastSeen', user.tag, lastSeen);
  }
  else {
    color = Kara.colors.RED;
    description = Kara.i18n.info(message.guild.language, 'notSeen', user.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      title: 'Last seen',
      description: description
    }
  });
};

exports.config = {
  aliases: [ 'seen' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'lastSeen',
  description: 'Shows the time since the specified user was last seen socializing in Discord.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lastSeen <@USER_MENTION | USER_ID>',
  example: [ 'lastSeen @Kara#0001', 'lastSeen 167144269485733961' ]
};
