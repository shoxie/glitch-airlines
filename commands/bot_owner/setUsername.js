/**
 * @file setUsername command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.join(' ').length >= 1) {
    await Kara.user.setUsername(args.join(' '));

    await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: `${Kara.user.username}'s username is now set to **${args.join(' ')}**`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'setun' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setUsername',
  description: 'Changes the username of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setUsername <text>',
  example: [ 'setUsername NewUsername' ]
};
