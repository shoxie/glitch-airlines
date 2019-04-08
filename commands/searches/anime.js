/**
 * @file anime command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let anime = await Kara.methods.makeBWAPIRequest('/kitsu/anime', {
    qs: {
      name: args.name
    }
  });

  anime = anime[0];

  if (anime) {
    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: Object.values(anime.titles)[0],
        url: `https://kitsu.io/anime/${anime.slug}`,
        description: anime.synopsis,
        fields: [
          {
            name: 'Status',
            value: anime.endDate ? 'Finished' : 'Airing',
            inline: true
          },
          {
            name: 'Aired',
            value: anime.endDate ? `${anime.startDate} - ${anime.endDate}` : `${anime.startDate} - Present`,
            inline: true
          },
          {
            name: 'Rating',
            value: `${anime.ageRating} - ${anime.ageRatingGuide} ${anime.nsfw ? '[NSFW]' : ''}`,
            inline: true
          }
        ],
        image: {
          url: anime.posterImage.original
        },
        footer: {
          text: 'Powered by Kitsu'
        }
      }
    });
  }
  else {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'anime'), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'anime',
  description: 'Searches for the details of an Anime.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'anime <Anime Name>',
  example: [ 'anime One Piece' ]
};
