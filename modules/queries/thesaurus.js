const thesaurus = require('thesaurus-com');

exports.exec = async (Bastion, message, args) => {
  try {
    var data =thesaurus.search(args)
data.synonyms.toString();
        message.channel.send({
          embed: {
            color: 3447003,
            title: 'Synonyms for your word',
            description:data.synonyms.toString()
          },
          footer: {
          text: 'Powered by Thesaurus'
        }
      });
      message.channel.send({
        embed: {
          color: 3447003,
          title: 'Antonyms for your word',
          description: data.antonyms.toString()
        },
        footer: {
        text: 'Powered by Thesaurus'
      }
    });
  }
  catch (e) {
    if (e.stack.includes('not supported')) {

      return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'invalidInput', true, 'language code'), message.channel);
    }
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'thes' ],
  enabled: true
};

exports.help = {
  name: 'thesaurus',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'thesaurus <text>',
  example: [ 'thesaurus idiot' ]
};
