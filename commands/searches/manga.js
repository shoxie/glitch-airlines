/**
 * @file manga command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let manga = await Kara.methods.makeBWAPIRequest('/kitsu/manga', {
    qs: {
      name: args.name
    }
  });

  manga = manga[0];

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: Object.values(manga.titles)[0],
      url: `https://kitsu.io/manga/${manga.slug}`,
      description: manga.synopsis,
      fields: [
        {
          name: 'Status',
          value: manga.endDate ? 'Finished' : 'Publishing',
          inline: true
        },
        {
          name: 'Published',
          value: manga.endDate ? `${manga.startDate} - ${manga.endDate}` : `${manga.startDate} - Present`,
          inline: true
        }
      ],
      image: {
        url: manga.posterImage.original
      },
      footer: {
        text: 'Powered by Kitsu'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'manga',
  description: 'Searches for the details of a Manga.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'manga <Manga Name>',
  example: [ 'manga Death Note' ]
};
