/**
 * @file animoji command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let emoji = message.guild.emojis.find(emoji => emoji.name === args.name);

  if (!emoji || !emoji.animated) return;

  await message.channel.send({
    files: [ emoji.url ]
  });
};

exports.config = {
  aliases: [ 'animote' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'animoji',
  description: 'Sends a large version of the specified animated emoji of your Discord server. And Nitro isn\'t required.',
  botPermission: '',
  userTextPermission: 'ADD_REACTIONS',
  userVoicePermission: '',
  usage: 'animoji <ANIMATED_EMOJI_NAME>',
  example: [ 'animoji PartyWumpus' ]
};
