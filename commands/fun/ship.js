/**
 * @file ship command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let users = message.mentions.users.map(u => u.username);
  if (users.length < 2) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let shippedName = '';
  for (let i = 0; i < users.length; i++) {
    shippedName += `${users[i].substring(0, users[i].length / 2)}`;
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Shipped Users',
      description: `${users.join(' + ')} = **${shippedName}**`
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'ship',
  description: 'Combines two or more mentioned user\'s names.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ship <USER_MENTION> <USER_MENTION> [...USER_MENTION]',
  example: [ 'ship user#0001 user#0002 user#0003' ]
};
