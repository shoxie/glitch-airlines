/**
 * @file movie command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.movie) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let movie = await Kara.methods.makeBWAPIRequest(`/movies/search/${args.movie}`);

  movie = movie.results[0];

  if (!movie) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'movie'), message.channel);
  }

  // Hard coded genre IDs because they are not likely to change for v3 and dynamically getting them would mean sending another request, since it's a seperate endpoint.
  let genre_list = { '28': 'Action', '12': 'Adventure', '16': 'Animation', '35': 'Comedy', '80': 'Crime', '99': 'Documentary', '18': 'Drama', '10751': 'Family', '14': 'Fantasy', '36': 'History', '27': 'Horror', '10402': 'Music', '9648': 'Mystery', '10749': 'Romance', '878': 'Science Fiction', '10770': 'TV Movie', '53': 'Thriller', '10752': 'War', '37': 'Western' };

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: movie.title,
      url: `https://themoviedb.org/movie/${movie.id}`,
      description: movie.overview,
      fields: [
        {
          name: 'Genre',
          value: movie.genre_ids.map(id => genre_list[id]).join('\n'),
          inline: true
        },
        {
          name: 'Language',
          value: movie.original_language.toUpperCase(),
          inline: true
        },
        {
          name: 'Rating',
          value: `${movie.vote_average}`,
          inline: true
        },
        {
          name: 'Release Date',
          value: movie.release_date,
          inline: true
        }
      ],
      image: {
        url: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      },
      footer: {
        text: 'Powered by The Movie Database'
      }
    }
  });
};

exports.config = {
  aliases: [ 'film' ],
  enabled: true,
  argsDefinitions: [
    { name: 'movie', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'movie',
  description: 'Searches for the details of a movie.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'movie <Movie Name>',
  example: [ 'movie John Wick' ]
};
