/**
 * @file sweep command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let sweepedUser = message.channel.members.filter(m => !m.user.bot).random();

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Sweeped user',
      fields: [
        {
          name: 'User',
          value: sweepedUser.user.tag,
          inline: true
        },
        {
          name: 'ID',
          value: sweepedUser.id,
          inline: true
        }
      ]
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'sweep',
  description: 'Shows a random user from the text channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'sweep',
  example: []
};
