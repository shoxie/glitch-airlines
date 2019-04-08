/**
 * @file choose command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.length < 1 || !/^(.+( ?\/ ?.+[^/])+)$/i.test(args = args.join(' '))) {
    return Kara.emit('commandUsage', message, this.help);
  }

  args = args.split('/');

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'In my opinion',
      description: args.getRandom()
    }
  });
};

exports.config = {
  aliases: [ 'decide' ],
  enabled: true
};

exports.help = {
  name: 'choose',
  description: 'Asks the bot to choose an option from a number of options.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'choose <choice1>/<choice2>[/<choice3>][...]',
  example: [ 'choose Chocolate/Ice Cream/Cake' ]
};
