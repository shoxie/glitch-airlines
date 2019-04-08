/**
 * @file disableCommand command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let disabledCommands, title, description;
  if (args.name) {
    let command = args.name.toLowerCase();

    if (Kara.commands.has(command) || Kara.aliases.has(command)) {
      if (Kara.commands.has(command)) {
        command = Kara.commands.get(command);
      }
      else if (Kara.aliases.has(command)) {
        command = Kara.commands.get(Kara.aliases.get(command).toLowerCase());
      }
    }
    else {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
    }

    if ([ 'enablecommand', 'disablecommand' ].includes(command.help.name.toLowerCase()) || !command.config.ownerOnly) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'commandNoDisable', command.help.name), message.channel);
    }

    let guildModel = await Kara.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });

    if (guildModel.dataValues.disabledCommands) {
      guildModel.dataValues.disabledCommands.push(command.help.name.toLowerCase());
    }
    else {
      guildModel.dataValues.disabledCommands = [ command.help.name.toLowerCase() ];
    }

    guildModel.dataValues.disabledCommands = [ ...new Set(guildModel.dataValues.disabledCommands) ];

    disabledCommands = guildModel.dataValues.disabledCommands;
    description = Kara.i18n.info(message.guild.language, 'disableCommand', message.author.tag, command.help.name);

    await Kara.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();
    if ([ 'bot_owner' ].includes(args.module)) {
      return Kara.emit('error', '', 'You can\'t disable commands in this module.', message.channel);
    }

    disabledCommands = Kara.commands.filter(c => c.config.module === args.module && ![ 'enablecommand', 'disablecommand' ].includes(c.help.name.toLowerCase())).map(c => c.help.name.toLowerCase());

    let guildModel = await Kara.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (guildModel.dataValues.disabledCommands) {
      disabledCommands = disabledCommands.concat(guildModel.dataValues.disabledCommands);
    }

    description = Kara.i18n.info(message.guild.language, 'disableModule', message.author.tag, args.module);

    await Kara.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else if (args.all) {
    disabledCommands = Kara.commands.filter(c => ![ 'enablecommand', 'disablecommand' ].includes(c.help.name.toLowerCase()) && !c.config.ownerOnly).map(c => c.help.name.toLowerCase());
    description = Kara.i18n.info(message.guild.language, 'disableAllCommands', message.author.tag);

    await Kara.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else {
    let guildModel = await Kara.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    title = 'Commands disabled in this server:';
    description = guildModel.dataValues.disabledCommands ? guildModel.dataValues.disabledCommands.join(', ') : 'No command has been disabled in this server. Check `help disableCommand` for more info.';
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      title: title,
      description: description
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'disablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'disableCommand',
  description: 'Disable command/module in your server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'disableCommand [ COMMAND_NAME | --module MODULE NAME | --all ]',
  example: [ 'disableCommand echo', 'disableCommand --module game stats', 'disableCommand --all' ]
};
