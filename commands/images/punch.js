/**
 * @file punch command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let user = message.mentions.users.first();
  if (!user) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let punches = [
    'https://i.giphy.com/media/iWEIxgPiAq58c/giphy.gif',
    'https://i.giphy.com/media/DViGV8rfVjw6Q/giphy.gif',
    'https://i.giphy.com/media/GoN89WuFFqb2U/giphy.gif',
    'https://i.giphy.com/media/xT0BKiwgIPGShJNi0g/giphy.gif',
    'https://i.giphy.com/media/Lx8lyPHGfdNjq/giphy.gif'
  ];

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: `${message.author.username} punched ${user.username}! :punch:`,
      image: {
        url: punches[Math.floor(Math.random() * punches.length)]
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'punch',
  description: 'Give a punch to another user.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'punch <@USER_MENTION>',
  example: [ 'punch @user#0001' ]
};
