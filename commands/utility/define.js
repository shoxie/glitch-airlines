/**
 * @file define command
 * @author Kara
 * @license GPL-3.0
 */

const wd = xrequire('word-definition');

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  for (let i = 0; i < args.length - 1; i++) {
    args[i] = args[i].toLowerCase();
  }
  let lang = args[0];
  if (!/^(en|fr|de)$/.test(lang)) {
    lang = 'en';
    args = args.join(' ');
  }
  else {
    args = args.slice(1).join(' ');
  }

  await wd.getDef(args, lang, null, async (data) => {
    let embed = {};
    if (data.err) {
      embed = {
        embed: {
          color: Kara.colors.RED,
          description: `No definition found for **${data.word}** in **${lang.toUpperCase()}** Dictionary.`
        }
      };
    }
    else {
      embed = {
        embed: {
          color: Kara.colors.BLUE,
          title: data.word,
          description: `*${data.category}*\n\n${data.definition}`,
          footer: {
            text: 'Powered by Wiktionary'
          }
        }
      };
    }

    await message.channel.send(embed);
  });
};

exports.config = {
  aliases: [ 'meaning' ],
  enabled: true
};

exports.help = {
  name: 'define',
  description: 'Searches the definition of the specified word from English, French or German dictionary.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'define [language_code] <word>',
  example: [ 'define Colonel', 'define de Soldat', 'define en Warrior', 'define fr Guerre' ]
};
