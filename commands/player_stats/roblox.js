/**
 * @file roblox command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Bastion, message, args) => {
  if (!args.player) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  let options = {
    uri: 'https://api.roblox.com/users/get-by-username',
    headers: {
      'User-Agent': `Kara/${Bastion.package.version} (${Bastion.user.tag}; ${Bastion.user.id}) https://bastionbot.org`
    },
    qs: {
      username: encodeURIComponent(args.player)
    },
    json: true
  };

  let response = await request(options);

  if (response.errorMessage) {
    return Bastion.emit('error', 'Roblox', response.errorMessage, message.channel);
  }

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Roblox Player',
      description: response.IsOnline ? 'Online' : 'Offline',
      fields: [
        {
          name: 'Player Username',
          value: response.Username,
          inline: true
        },
        {
          name: 'Player ID',
          value: response.Id,
          inline: true
        }
      ],
      footer: {
        text: 'Powered by Roblox'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'roblox',
  description: 'Get info of any Roblox player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roblox <ROBLOX_USERNAME>',
  example: [ 'roblox Candice' ]
};
