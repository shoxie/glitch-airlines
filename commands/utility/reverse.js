/**
 * @file reverse command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.length < 1) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Reversed Text',
      description: args.join(' ').split('').reverse().join('')
    }
  });
};

exports.config = {
  aliases: [ 'rev' ],
  enabled: true
};

exports.help = {
  name: 'reverse',
  description: 'Sends the same message that you had sent but reversed.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reverse <text>',
  example: [ 'reverse !looc si sihT' ]
};
