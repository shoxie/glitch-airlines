/**
 * @file generateInvite command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let invite = await message.channel.createInvite({
    maxAge: args.age * 60,
    maxUses: args.uses
  });

  await message.channel.send('Hello. Beep. Boop.\n'
    + 'If you wanna invite friends to this server, share the following invite'
    + ' link with your friends.\nBeep!\n' +
    `https://discord.gg/${invite.code}`);
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'uses', type: Number, alias: 'u', defaultValue: 3 },
    { name: 'age', type: Number, alias: 'a', defaultValue: 1440 }
  ]
};

exports.help = {
  name: 'generateInvite',
  description: 'Generates an invite link of the current text channel of your Discord server.',
  botPermission: 'CREATE_INSTANT_INVITE',
  userTextPermission: 'CREATE_INSTANT_INVITE',
  userVoicePermission: '',
  usage: 'generateInvite [-u <NO_OF_USES>] [-a <INVITE_LINK_TIMEOUT_IN_MINUTES>]',
  example: [ 'generateInvite', 'generateInvite -u 1 -a 10' ]
};
