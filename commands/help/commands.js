/**
 * @file commands command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let categories = Bastion.commands.map(c => c.config.module.toLowerCase()).unique();

  if (!args.category) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.GOLD,
        title: 'List of Command Categories',
        fields: [
          {
            name: 'Command Categories',
            value: categories.map(m => m.replace(/_/g, ' ').toTitleCase()).join('\n')
          }
        ],
        footer: {
          text: `Did you know? There are ${Bastion.commands.size} commands in this version of Kara!`
        }
      }
    });
  }

  args.category = args.category.join('_').toLowerCase();
  if (!categories.includes(args.category)) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.RED,
        title: 'Invalid Command Cateogry',
        description: 'Use the `commands` command without any arguments to get a list of all the available command categories.'
      }
    });
  }

  let commands = Bastion.commands.filter(c => c.config.module === args.category);
  args.category = args.category.replace(/_/g, ' ').toTitleCase();

  await message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: `List of Commands in ${args.category} category`,
      description: `Use the \`commands\` command to get a list of all the ${categories.length} command categories.`,
      fields: [
        {
          name: `${commands.size} ${args.category} Commands`,
          value: `\`\`\`css\n${commands.map(c => c.help.name).join('\n')}\`\`\``
        },
        {
          name: 'Need more details?',
          value: 'Check out the help message of the command, using the `help <command>` command.'
        }
        
      ],
      footer: {
        text: `Did you know? There are ${Bastion.commands.size} commands in this version of Kara!`
      }
    }
  });
};

exports.config = {
  aliases: [ 'cmds' ],
  enabled: true,
  argsDefinitions: [
    { name: 'category', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'commands',
  description: 'Shows the list of command categories. And if a category is specified, Kara will show a list of commands in that category.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commands [category]',
  example: [ 'commands', 'commands game stats', 'commands moderation' ]
};
