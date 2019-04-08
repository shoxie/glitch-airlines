/**
 * @file setActivity command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.name) {
    args.name = args.name.join(' ');

    await Kara.user.setActivity(args.name, { type: args.type });

    await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: `My activity is now set to **${args.type} ${args.name}**`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
  else {
    let game = typeof Kara.configurations.game.name === 'string' ? Kara.configurations.game.name : Kara.configurations.game.name.length ? Kara.configurations.game.name[0] : null;
    await Kara.user.setActivity(game, { type: Kara.configurations.game.type });

    await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: `My activity has been reset to the default: **${Kara.configurations.game.type} ${game}**`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
};

exports.config = {
  aliases: [ 'setGame' ],
  enabled: true,
  ownerOnly: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'type', type: String, alias: 't', defaultValue: 'Playing' }
  ]
};

exports.help = {
  name: 'setActivity',
  description: 'Sets the activity of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setActivity [ ACTIVITY NAME [-t ACTIVITY_TYPE] ]',
  example: [ 'setActivity minions! -t Watching', 'setActivity with you', 'setActivity' ]
};
