/**
 * @file directMessageHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

/**
 * Handles direct messages sent to Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = message => {
  let prefix = message.client.config.prefix;

  if (message.content.startsWith(prefix)) {
    let args = message.content.split(' ');
    let command = args.shift().slice(prefix.length).toLowerCase();

    if (command === 'help' || command === 'h') {
      return message.channel.send({
        embed: {
          color: message.client.colors.BLUE,
          title: 'Time Bureau Council',
          url: 'https://discord.gg/YDsHng6',
          description: 'Join [**The Bureau**](https://discord.gg/YDsHng6) to test out and it\'s commands, for giveaway events, for chatting and for a lot of fun!',
          fields: [
            {
              name: 'Time Bureau Council',
              value: 'https://discord.gg/YDsHng6'
            },
            {
              name: 'Kara Airlines Bot',
              value: `https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=2146958463`
            }
          ],
          thumbnail: {
            url: message.client.user.displayAvatarURL
          },
          footer: {
            text: 'Sia Furler with love <3'
          }
        }
      }).catch(e => {
        message.client.log.error(e);
      });
    }
  }
};
