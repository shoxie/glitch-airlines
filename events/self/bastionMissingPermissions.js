/**
 * @file bastionMissingPermissions event
 * @author Kara
 * @license GPL-3.0
 */

module.exports = (permissions, message) => {
  if (!message) return;

  message.channel.send({
    embed: {
      color: message.client.colors.RED,
      description: message.client.i18n.error(message.guild.language, 'bastionMissingPermissions', permissions.replace('_', ' '))
    }
  }).catch(e => {
    message.client.log.error(e);
  });
};
