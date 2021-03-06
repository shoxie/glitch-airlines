/**
 * @file fakeBan command
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

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: `**${message.author.tag}** has banned **${user.tag}** from this server.*`,
      footer: {
        text: '* Oh, just kidding! XD'
      }
    }
  });
};

exports.config = {
  aliases: [ 'fban' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'fakeBan',
  description: 'Bans a user from the server*. Oh, not really though, just to mess with them.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fakeBan [ @USER_MENTION | USER_ID ]',
  example: []
};
