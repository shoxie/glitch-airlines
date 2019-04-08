/**
 * @file addTrigger command
 * @author Kara
 * @license GPL-3.0
 */

const emojis = xrequire('./assets/emojis.json');

exports.exec = async (Kara, message, args) => {
  if (!args.trigger || !(args.text || args.embed || args.reaction)) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let triggerModels = await message.client.database.models.trigger.findAll({
    attributes: [ [ message.client.database.fn('COUNT', message.client.database.col('trigger')), 'noOfTriggers' ] ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!Kara.credentials.ownerId.includes(message.author.id) && triggerModels && triggerModels.dataValues.noOfTriggers >= 10) {
    return Kara.emit('error', 'forbidden', 'You can\'t set more than 10 triggers per server, for now. This limit will be increased in the future.', message.channel);
  }

  let responseObject = {};

  if (args.text) {
    responseObject.text = args.text.join(' ');
  }
  if (args.embed) {
    args.embed = args.embed.join(' ');
    Object.assign(responseObject, JSON.parse(args.embed));

    delete responseObject.footer;
  }
  if (args.reaction) {
    args.reaction = encodeURIComponent(args.reaction);

    if (!emojis.includes(args.reaction)) {
      if (!Object.keys(responseObject).size) {
        return Kara.emit('error', 'invalidInput', 'The emoji you entered is invalid. Note that custom emojis aren\'t supported currently.', message.channel);
      }
    }
  }

  await Kara.database.models.trigger.create({
    guildID: message.guild.id,
    trigger: args.trigger.join(' '),
    responseMessage: responseObject,
    responseReactions: args.reaction
  },
  {
    fields: [ 'guildID', 'trigger', 'responseMessage', 'responseReactions' ]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'New Trigger Added',
      fields: [
        {
          name: 'Trigger',
          value: args.trigger.join(' ')
        },
        {
          name: 'Response',
          value: args.embed
            ? args.embed.length > 1024
              ? '*A Message Embed.*'
              : `\`\`\`json\n${args.embed}\`\`\``
            : args.text
              ? args.text.join(' ')
              : decodeURIComponent(args.reaction)
        }
      ]
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'addtrip' ],
  enabled: true,
  argsDefinitions: [
    { name: 'trigger', type: String, multiple: true, defaultOption: true },
    { name: 'text', type: String, alias: 't', multiple: true },
    { name: 'embed', type: String, alias: 'e', multiple: true },
    { name: 'reaction', type: String, alias: 'r' }
  ]
};

exports.help = {
  name: 'addTrigger',
  description: 'Adds a message trigger and a response. When a message is sent that contains that triggering word/phrase, Kara replies with the response you have set.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addTrigger <trigger text> <-t text response | -e embed object | -r reaction emoji> ',
  example: [ 'addTrigger Hi, there? -t Hello $user! :wave:', 'addTrigger Hi, there? -e { "description": "Hello $user! :wave:"}', 'addTrigger Hi, there? -r :wave:' ]
};
