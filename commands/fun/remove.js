/**
 * @file remove command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: `${args.length ? `${args.join(' ')} is` : 'You are'} being removed.`,
      image: {
        url: 'https://resources.bastionbot.org/images/remove_button.gif'
      }
    }
  });
};

exports.config = {
  aliases: [ 'delete' ],
  enabled: true
};

exports.help = {
  name: 'remove',
  description: 'Have fun removing stuff you don\'t like. Specify the item(s) you want to remove. Won\'t be real though!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'remove <text>',
  example: [ 'remove Humanity' ]
};
