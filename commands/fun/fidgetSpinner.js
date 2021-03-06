/**
 * @file fidgetSpinner command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let spinning = await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: `${message.author.tag} is spinning a fidget spinner...`,
      image: {
        url: 'https://i.imgur.com/KJJxVi4.gif'
      }
    }
  });

  let timeout = (Math.random() * (60 - 5 + 1)) + 5;
  setTimeout(() => {
    spinning.edit({
      embed: {
        color: Kara.colors.BLUE,
        description: `${message.author.tag}, you spinned the fidget spinner for ${timeout.toFixed(2)} seconds.`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }, timeout * 1000);
};

exports.config = {
  aliases: [ 'fidget' ],
  enabled: true
};

exports.help = {
  name: 'fidgetSpinner',
  description: 'Spins a fidget spinner for you and shows for how long it was spinning.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fidgetSpinner',
  example: []
};
