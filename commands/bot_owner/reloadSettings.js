/**
 * @file reloadSettings command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  if (Kara.shard) {
    await Kara.shard.broadcastEval('this.reloadSettings()');
  }
  else {
    Kara.reloadSettings();
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: 'Successfully reloaded all the settings.'
    }
  }).catch(e => {
    Kara.log.error(e);
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
