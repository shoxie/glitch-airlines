/**
 * @file resetDatabase command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.profiles) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await Kara.database.models.guildMember.destroy({
    truncate: true
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: 'Kara `profiles` database was successfully reset.'
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'resetdb' ],
  enabled: true,
  argsDefinitions: [
    { name: 'profiles', type: Boolean, alias: 'p' }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'resetDatabase',
  description: 'Resets all the data from a specified table of %bastion%\'s database.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'resetDatabase < --profiles >',
  example: [ 'resetDatabase --profiles' ]
};
