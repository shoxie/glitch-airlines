/**
 * @file emoji command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = xrequire('fs');

exports.exec = (Bastion, message, args) => {
  if (!args.name && !args.list) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (args.name) {
    args.name = args.name.toLowerCase();
    fs.stat(`./assets/emojis/${args.name}.png`, async (error, stat) => {
      // If the emoji doesn't exist or is not readable, just return.
      if (error) return;

      // If the emoji exists, send the emoji.
      if (stat) {
        await message.channel.send({
          files: [ `./assets/emojis/${args.name}.png` ]
        });
      }
    });
  }
  else {
    fs.readdir('./assets/emojis', async (error, emojis) => {
      if (error) return;

      // Trim the extentions of the emojis.
      emojis = emojis.map(e => e.substr(0, e.length - 4));

      // Send the list of emojis available.
      await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: 'Kara Emojis',
          description: emojis.join(', ')
        }
      });
    });
  }
};

exports.config = {
  aliases: [ 'emote' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', defaultOption: true },
    { name: 'list', type: Boolean, alias: 'l' }
  ]
};

exports.help = {
  name: 'emoji',
  description: 'Sends a large version of the specified emoji.',
  botPermission: '',
  userTextPermission: 'ADD_REACTIONS',
  userVoicePermission: '',
  usage: 'emoji < emoji_name | --list >',
  example: [ 'emoji yum', 'emoji --list' ]
};
