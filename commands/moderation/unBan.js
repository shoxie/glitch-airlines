/**
 * @file unBan command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  try {
    if (!args.id) {
      return Kara.emit('commandUsage', message, this.help);
    }

    args.reason = args.reason.join(' ');

    let user = await message.guild.unban(args.id, args.reason);

    await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: Kara.i18n.info(message.guild.language, 'unban', message.author.tag, user.tag, args.reason)
      }
    }).catch(e => {
      Kara.log.error(e);
    });

    Kara.emit('moderationLog', message, this.help.name, user, args.reason);
  }
  catch (e) {
    if (e.code === 10013) {
      Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'user'), message.channel);
    }
    else {
      throw e;
    }
  }
};

exports.config = {
  aliases: [ 'ub' ],
  enabled: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'reason', type: String, alias: 'r', multiple: true, defaultValue: [ 'No reason given.' ] }
  ]
};

exports.help = {
  name: 'unBan',
  description: 'Unbans a specified user for your Discord server.',
  botPermission: 'BAN_MEMBERS',
  userTextPermission: 'BAN_MEMBERS',
  userVoicePermission: '',
  usage: 'unBan <USER_ID> -r [Reason].',
  example: [ 'unBan 186640658873224631 -r Has apologized for his mistakes' ]
};
