/**
 * @file forecast command
 * @author Kara
 * @license GPL-3.0
 */

const weather = xrequire('weather-js');

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await weather.find({ search: args.join(' '), degreeType: 'C' }, async (err, result) => {
    if (err) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'weatherNotFound'), message.channel);
    }

    if (!result || !result.length) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'connection'), message.channel);
    }

    let fields = [];
    for (let i = 0; i < result[0].forecast.length; i++) {
      fields.push({
        name: new Date(result[0].forecast[i].date).toDateString(),
        value: `**Condition:** ${result[0].forecast[i].skytextday}\n**Low:** ${result[0].forecast[i].low} \u00B0${result[0].location.degreetype}\n**Hign:** ${result[0].forecast[i].high} \u00B0${result[0].location.degreetype}\n**Precipitation:** ${result[0].forecast[i].precip} cm`
      });
    }

    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: 'Weather Forecast',
        description: result[0].location.name,
        fields: fields,
        footer: {
          text: 'Powered by MSN Weather'
        }
      }
    });
  });
};

exports.config = {
  aliases: [ 'wefc' ],
  enabled: true
};

exports.help = {
  name: 'forecast',
  description: 'Shows the weather forecast for 5 days of the specified city.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'forecast < city, country_code | zipcode >',
  example: [ 'forecast London, UK', 'forecast 94109' ]
};
