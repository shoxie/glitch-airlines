/**
 * @file createEmoji command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.url || !/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png)$/i.test(args.url) || !args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let emoji = await message.guild.createEmoji(args.url, args.name.join('_'));

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: Kara.i18n.info(message.guild.language, 'createEmoji', message.author.tag, emoji.name)
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true },
    { name: 'name', type: String, alias: 'n', multiple: true }
  ]
};

exports.help = {
  name: 'createEmoji',
  description: 'Creates a new emoji on your Discord server.',
  botPermission: 'MANAGE_EMOJIS',
  userTextPermission: 'MANAGE_EMOJIS',
  userVoicePermission: '',
  usage: 'createEmoji <EmojiURL> -n <EmojiName>',
  example: [ 'createEmoji https://bastionbot.org/assets/images/bastion.png -n KaraBot' ]
};
