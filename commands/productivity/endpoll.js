/**
 * @file endpoll command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (message.channel.poll && message.channel.poll.collector) {
    await message.channel.poll.collector.stop();
  }
};

exports.config = {
  aliases: [ 'pollend' ],
  enabled: true
};

exports.help = {
  name: 'endpoll',
  description: 'Ends a currently running poll in the same text channel and shows the result.',
  botPermission: '',
  userTextPermission: 'MANAGE_MESSAGES',
  userVoicePermission: '',
  usage: 'endpoll',
  example: []
};
