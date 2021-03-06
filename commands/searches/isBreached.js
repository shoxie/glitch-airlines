/**
 * @file isBreached command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  args.name = args.name.join('');

  let breachedSite = await Kara.methods.makeBWAPIRequest(`/pwned/site/${args.name}`);

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      author: {
        name: breachedSite.Title,
        url: `http://${breachedSite.Domain}`
      },
      fields: [
        {
          name: 'Compromised Data',
          value: breachedSite.DataClasses.join(', ')
        },
        {
          name: 'Breach Date',
          value: breachedSite.BreachDate,
          inline: true
        },
        {
          name: 'Verified',
          value: breachedSite.IsVerified,
          inline: true
        }
      ],
      footer: {
        text: 'Powered by Have I been pwned?'
      }
    }
  });
};

exports.config = {
  aliases: [ 'isPwned' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'isBreached',
  description: 'Check if a site has been breached in the past.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'isBreached <site_name>',
  example: [ 'isBreached Adobe' ]
};
