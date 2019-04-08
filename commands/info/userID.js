/**
 * @file userID command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let user = message.mentions.users.first();
  if (!user) {
    user = message.author;
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      fields: [
        {
          name: `${user.bot ? 'Bot' : 'User'}`,
          value: user.tag,
          inline: true
        },
        {
          name: 'ID',
          value: user.id,
          inline: true
        }
      ]
    }
  });
};

exports.config = {
  aliases: [ 'uid' ],
  enabled: true
};

exports.help = {
  name: 'userID',
  description: 'Shows ID of a specified user of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'userID [@user-mention]',
  example: [ 'userID @user#0001', 'userID' ]
};
