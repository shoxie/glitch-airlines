/**
 * @file setStream command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!/^((https:\/\/)(www\.)?(twitch\.tv)\/[a-z0-9-._]+)$/i.test(args[0]) || args.slice(1).join(' ').length < 1) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await Kara.user.setActivity(args.slice(1).join(' '), {
    type: 1,
    url: args[0]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: `${Kara.user.username} is now streaming **${args.slice(1).join(' ')}**`
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
  name: 'setStream',
  description: 'Sets the video stream of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setStream <twitch> <Status text>',
  example: [ 'setStream https://twitch.tv/k3rn31p4nic Nothing' ]
};
