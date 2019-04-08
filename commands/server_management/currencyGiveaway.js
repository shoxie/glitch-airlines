/**
 * @file currencyGiveaway command
 * @author Kara
 * @license GPL-3.0
 */

let giveaway, activeGuilds = [];

exports.exec = async (Kara, message, args) => {
  if (!activeGuilds.includes(message.guild.id)) {
    if (!args.amount || isNaN(args.amount)) {
      return Kara.emit('commandUsage', message, this.help);
    }

    /**
     * Time in hour(s) the giveaway event should go on.
     * @constant
     * @type {number}
     * @default
     */
    const TIMEOUT = 3;
    let reaction = [ '📦', '🎈', '🎊', '🎉', '🎃', '🎁', '🔮', '🎀', '🎐', '🏮' ];

    reaction = reaction[Math.floor(Math.random() * reaction.length)];

    let giveawayMessage = await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: 'GIVEAWAY! 🎉',
        description: `Giveaway event started. React to this message with ${reaction} to get a chance to win **${args.amount}** $.`,
        footer: {
          text: `Event stops in ${TIMEOUT} hours. You will get your reward after the event has concluded.`
        }
      }
    });
    await giveawayMessage.react(reaction);

    let giveawayMessageID = giveawayMessage.id;
    activeGuilds.push(message.guild.id);

    giveaway = Kara.setTimeout(async () => {
      try {
        let giveawayMessage = await message.channel.fetchMessage(giveawayMessageID);

        // reaction = encodeURIComponent(reaction);

        let winners = [];
        if (giveawayMessage.reactions.get(reaction)) {
          winners = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => u.id);
        }

        let winner;
        while (!winner && winners.length) {
          winner = winners[Math.floor(Math.random() * winners.length)];
          winners.splice(winners.indexOf(winner), 1);
          winner = await Kara.fetchUser(winner).catch(() => {});
        }

        if (winner) {
          Kara.emit('userDebit', message.guild.members.get(winner.id), args.amount);

          await giveawayMessage.edit('', {
            embed: {
              color: Kara.colors.BLUE,
              title: 'Giveaway Event Ended',
              description: `${winner} won the giveaway! And has been awarded with **${args.amount}** $.\nThank you everyone for participating. Better luck next time.`
            }
          });

          await winner.send({
            embed: {
              color: Kara.colors.BLUE,
              title: 'Congratulations',
              description: `You won the giveaway in **${message.guild.name}** Server! And you've been awarded with **${args.amount}** $.`
            }
          }).catch(() => {});
        }
        else {
          await giveawayMessage.edit('', {
            embed: {
              color: Kara.colors.RED,
              title: 'Giveaway Event Ended',
              description: 'Unfortunately, no one participated and apparently there\'s no winner. 😕'
            }
          }).catch(e => {
            Kara.log.error(e);
          });
        }

        activeGuilds.splice(activeGuilds.indexOf(message.guild.id), 1);
      }
      catch (e) {
        Kara.log.error(e);
      }
    }, TIMEOUT * 60 * 60 * 1000);
  }
  else {
    if (args.end) {
      Kara.clearTimeout(giveaway);
      activeGuilds.splice(activeGuilds.indexOf(message.guild.id), 1);

      await message.channel.send({
        embed: {
          color: Kara.colors.RED,
          title: 'Giveaway Event Ended',
          description: `The giveaway event was abruptly ended by ${message.author.tag}. Sorry, no giveaways this time!`
        }
      }).catch(e => {
        Kara.log.error(e);
      });
    }
    else {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'isEventInUse', 'giveaway'), message.channel);
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'amount', type: Number, multiple: true, defaultOption: true },
    { name: 'end', type: Boolean, alias: 'e' }
  ],
  guildOwnerOnly: true
};

exports.help = {
  name: 'currencyGiveaway',
  description: 'Starts a giveaway event for a specific time, users receive the specified amount of %currency.name_plural% after the event is concluded.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'currencyGiveaway <amount | --end>',
  example: [ 'currencyGiveaway 10', 'currencyGiveaway --end' ]
};
