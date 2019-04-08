/**
 * @file setStatus command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.status && /^(?:online|idle|dnd|invisible)$/i.test(args.status)) {
    await Kara.user.setStatus(args.status);

    await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: `${Kara.user.username}'s status is now set to **${args.status}**`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
  else {
    await Kara.user.setStatus(Kara.configurations.status);

    await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: `${Kara.user.username}'s status is now set to the default status **${Kara.configurations.status}**`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'status', type: String, defaultOption: true }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'setStatus',
  description: 'Sets the status of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setStatus [online|idle|dnd|invisible]',
  example: [ 'setStatus invisible', 'setStatus' ]
};
