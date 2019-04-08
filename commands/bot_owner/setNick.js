/**
 * @file setNick command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!message.member.hasPermission('CHANGE_NICKNAME')) return;

  let description;

  if (args.length) {
    await message.guild.me.setNickname(args.join(' '));
    description = `${Kara.user.username}'s nick is now set to **${args.join(' ')}** on this server.`;
  }
  else {
    await message.guild.me.setNickname('');
    description = `${Kara.user.username}'s nick has been reset on this server.`;
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: description
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'setn' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'setNick',
  description: 'Sets the nickname of Kara in the current Discord server.',
  botPermission: 'CHANGE_NICKNAME',
  userTextPermission: 'CHANGE_NICKNAME',
  userVoicePermission: '',
  usage: 'setNick [text]',
  example: [ 'setNick NewNick', 'setNick' ]
};
