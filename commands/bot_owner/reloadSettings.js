/**
 * @file reloadSettings command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  if (Bastion.shard) {
    await Bastion.shard.broadcastEval('this.reloadSettings()');
  }
  else {
    Bastion.reloadSettings();
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: 'Successfully reloaded all the settings.'
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'reloadSettings',
  description: 'Reloads Kara settings, stored in the `settings` directory, from the cache. When you modify files in the `settings` directory, use this command to reload them without any need to restart.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'reloadSettings',
  example: []
};
