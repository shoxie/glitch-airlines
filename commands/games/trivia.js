/**
 * @file trivia command
 * @author Kara
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');
let activeChannels = [];

exports.exec = async (Kara, message, args) => {
  if (activeChannels.includes(message.channel.id))  {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'isGameInUse', 'trivia'), message.channel);
  }

  let difficulties = [ 'easy', 'medium', 'hard' ];
  args.difficulty = difficulties.includes(args.difficulty.toLowerCase()) ? args.difficulty.toLowerCase() : 'easy';

  let options = {
    method: 'GET',
    url: `https://opentdb.com/api.php?amount=1&type=boolean&difficulty=${args.difficulty}&encode=url3986`,
    json: true
  };
  let response = await request(options);

  if (!response) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'connection'), message.channel);
  }

  response = response.results[0];

  let question = await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Trivia - True/False',
      description: decodeURIComponent(response.question),
      fields: [
        {
          name: 'Category',
          value: decodeURIComponent(response.category),
          inline: true
        },
        {
          name: 'Difficulty',
          value: response.difficulty.toTitleCase(),
          inline: true
        }
      ],
      footer: {
        text: 'Reply with either True/False within 60 seconds.'
      }
    }
  });

  activeChannels.push(message.channel.id);

  let validAnswers = [
    'true',
    'false'
  ];

  const trivia = message.channel.createMessageCollector(
    msg => !msg.author.bot && validAnswers.includes(msg.content.toLowerCase()),
    { maxMatches: 1, time: 60 * 1000 }
  );

  trivia.on('collect', ans => {
    let color, description;
    if (ans.content.toLowerCase() === response.correct_answer.toLowerCase()) {
      color = Kara.colors.BLUE;
      description = `${ans.author.tag} you're absolutely right.`;
    }
    else {
      color = Kara.colors.RED;
      description = `Unfortunately, you're wrong ${ans.author.tag}`;
    }

    message.channel.send({
      embed: {
        color: color,
        description: description
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  });

  trivia.on('end', (answers, reason) => {
    activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);

    if (reason === 'time') {
      message.channel.send({
        embed: {
          color: Kara.colors.RED,
          title: 'Trivia Ended',
          description: 'Trivia was ended as no one was able to answer within 60 seconds.'
        }
      }).then(() => {
        question.delete().catch(() => {});
      }).catch(e => {
        Kara.log.error(e);
      });
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'difficulty', type: String, alias: 'd', defaultValue: 'easy', defaultOption: true }
  ]
};

exports.help = {
  name: 'trivia',
  description: 'Asks a trivia question. Answer and see how much knowledge you\'ve on everything.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'trivia [ --difficulty easy|medium|hard ]',
  example: [ 'trivia', 'trivial --difficulty hard' ]
};
