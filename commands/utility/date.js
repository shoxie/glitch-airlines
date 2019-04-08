/**
 * @file date command
 * @author Kara
 * @license GPL-3.0
 */

const location = xrequire('weather-js');

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await location.find({ search: args.join(' ') }, async (err, result) => {
    if (err) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'location'), message.channel);
    }

    if (!result || !result.length) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'connection'), message.channel);
    }

    let date = Kara.methods.timezoneOffsetToDate(parseFloat(result[0].location.timezone)).toUTCString();
    date = date.substring(0, date.length - 4);

    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        fields: [
          {
            name: 'Location',
            value: result[0].location.name
          },
          {
            name: 'Date & Time',
            value: date
          }
        ]
      }
    });
  });
};

exports.config = {
  aliases: [ 'time' ],
  enabled: true
};

exports.help = {
  name: 'date',
  description: 'Shows the local date and time of any specified city.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'date < location name[, country code] | zip code >',
  example: [ 'date New York, US', 'date 94109' ]
};
