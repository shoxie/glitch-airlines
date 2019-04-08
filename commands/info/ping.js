/**
 * @file ping command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let responseMessage = await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: 'PINGing...'
    }
  });
  await responseMessage.edit({
    embed: {
      color: Kara.colors.BLUE,
      title: `${Kara.user.username} PING Statistics`,
      fields: [
        {
          name: 'Response Time',
          value: `${responseMessage.createdTimestamp - message.createdTimestamp}ms`,
          inline: true
        },
        {
          name: 'WebSocket PING',
          value: `${Kara.ping}ms`,
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
  name: 'ping',
  description: 'Shows the response time and average WebSocket ping of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'ping',
  example: []
};
