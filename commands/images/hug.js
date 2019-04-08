/**
 * @file hug command
 * @author Kara
 * @license MIT
 */

const request = require('request-promise-native');

exports.exec = async (Kara, message) => {
  let options = {
    url: 'http://api.giphy.com/v1/gifs/search',
    qs: {
      q: 'hug',
      api_key: 'dc6zaTOxFJmzC',
      limit: 10,
      offset: 0
    },
    json: true
  };

  let response = await request(options);

  if (!response.data.length) {
    return Kara.emit('error', Kara.strings.error(message.guild.language, 'notFound'), Kara.strings.error(message.guild.language, 'notFound', true, 'image'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: `A hug from ${message.author.tag}`,
      image: {
        url: response.data[Math.floor(Math.random() * response.data.length)].images.original.url
      },
      footer: {
        text: 'Powered by GIPHY'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'hug',
  description: 'Give a hug to someone!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'hug',
  example: [ 'hug' ]
};
