/**
 * @file addFilteredWords command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'filteredWords' ],
    where: {
      guildID: message.guild.id
    }
  });

  let filteredWords = [];
  if (guildModel.dataValues.filteredWords) {
    filteredWords = guildModel.dataValues.filteredWords;
  }
  filteredWords = filteredWords.concat(args);
  filteredWords = [ ...new Set(filteredWords) ];

  await Kara.database.models.guild.update({
    filteredWords: filteredWords
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'filteredWords' ]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'Added Words to Filter List',
      description: args.join(', ')
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'addfw' ],
  enabled: true
};

exports.help = {
  name: 'addFilteredWords',
  description: 'Adds specified words to the list of filtered words. If someone sends a message containing these words, their message will be automatically deleted.',
  botPermission: 'MANAGE_MESSAGES',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addFilteredWords word [anotherWord] [someOtherWord]',
  example: [ 'addFilteredWords cast creed race religion' ]
};
