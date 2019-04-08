/**
 * @file shorten command
 * @author Kara
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  args = encodeURI(args.join(' '));
  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'invalidInput', 'URL'), message.channel);
  }

  let options = {
    url: `https://www.googleapis.com/urlshortener/v1/url?key=${Kara.credentials.googleAPIkey}`,
    method: 'POST',
    json: {
      longUrl: args
    }
  };

  let response = await request(options);

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      fields: [
        {
          name: 'Long URL',
          value: args
        },
        {
          name: 'Short URL',
          value: response.id
        }
      ],
      footer: {
        text: 'Powered by Google'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'shorten',
  description: 'Shortens a specified URL using Google URL Shortener.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shorten <URL>',
  example: [ 'shorten https://bastionbot.org/SomeLongURL' ]
};
