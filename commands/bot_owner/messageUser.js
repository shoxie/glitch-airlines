/**
 * @file messageUser command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  try {
    if (!args.length || !(parseInt(args[0]) < 9223372036854775807)) {
      return Kara.emit('commandUsage', message, this.help);
    }

    let user = await Kara.fetchUser(args[0]);

    let DMChannel = await user.createDM();
    await DMChannel.send({
      embed: {
        color: Kara.colors.BLUE,
        description: args.slice(1).join(' ')
      }
    }).catch(e => {
      if (e.code === 50007) {
        Kara.emit('error', '', 'Can\'t send message to this user. They might have disabled their DM or they don\'t share a server with me.', message.channel);
      }
      else {
        throw e;
      }
    });
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
  aliases: [ 'msgu' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'messageUser',
  description: 'Send a specified message to any specified user that Kara has access to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'messageUser <user_id> <message>',
  example: [ 'messageUser USER_ID Hello, how are you?' ]
};
