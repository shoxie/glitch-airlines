/**
 * @file giveaway command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!('giveaways' in message.guild)) {
    message.guild.giveaways = new Map();
  }

  if (args.item) {
    // Giveaway item name
    args.item = args.item.join(' ');

    // Verify whether timeout is within 12 hours
    if (!args.timeout.inRange(1, 12)) {
      return Kara.emit('error', '', 'Giveaway can only run for at least an hour and at most 12 hours.', message.channel);
    }

    // Generate a random reaction for the giveaway message
    let reaction = [ '📦', '🎈', '🎊', '🎉', '🎃', '🎁', '🔮', '🎀', '🎐', '🏮' ];
    reaction = reaction.getRandom();

    // Send the giveaway message and add the reaction to it
    let giveawayMessage = await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        author: {
          name: 'GIVEAWAY!'
        },
        title: args.item,
        description: `React to this message with ${reaction} to participate.`,
        footer: {
          text: `${args.winners} Winners • Ends`
        },
        timestamp: new Date(Date.now() + args.timeout * 60 * 60 * 1000)
      }
    });
    await giveawayMessage.react(reaction);

    // Giveaway message details
    let giveawayMessageID = giveawayMessage.id;

    // Start giveaway timeout
    let giveaway = Kara.setTimeout(async () => {
      // Fetch the giveaway message to get new reactions
      giveawayMessage = await message.channel.fetchMessage(giveawayMessageID);

      // Get (only) the users who reacted to the giveaway message
      let participants;
      if (giveawayMessage.reactions.has(reaction)) {
        participants = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => `**${u.tag}** / ${u.id}`);
      }

      // Get random users (winners) from the participants
      let winners;
      if (participants.length) {
        winners = Kara.methods.getRandomElements(participants, args.winners, true);
      }

      // If there're winners declare the result
      if (winners) {
        // Declare the result in the channel
        await giveawayMessage.edit({
          embed: {
            color: Kara.colors.BLUE,
            author: {
              name: 'GIVEAWAY Ended'
            },
            title: args.item,
            description: `The following users have won and will be contacted by ${message.author.tag} with their reward.\nThank you everyone for participating. Better luck next time.`,
            fields: [
              {
                name: 'Winners',
                value: winners.join('\n')
              }
            ],
            footer: {
              text: `Giveaway ID: ${giveawayMessageID}`
            }
          }
        }).catch(e => {
          if (e.code !== 50001) {
            throw e;
          }
        });
      }
      // Otherwise state the unfortunate outcome
      else {
        await giveawayMessage.edit({
          embed: {
            color: Kara.colors.RED,
            title: 'Giveaway Event Ended',
            description: `Unfortunately, no one participated and apparently there's no winner for **${args.item}**. 😕`,
            footer: {
              text: `Giveaway ID: ${giveawayMessageID}`
            }
          }
        }).catch(e => {
          if (e.code !== 50001) {
            throw e;
          }
        });
      }

      // Remove the giveaway details from cache
      message.guild.giveaways.delete(giveawayMessageID);
    }, args.timeout * 60 * 60 * 1000);

    // Store the giveaway information in cache.
    message.guild.giveaways.set(giveawayMessageID, giveaway);
  }
  else if (args.reroll) {
    if (message.guild.giveaways.has(args.reroll)) {
      return Kara.emit('error', Kara.i18n.error(message.guild.language, 'notFound'), 'That giveaway is currently running in this server. You can only reroll concluded or abruptly stopped giveaways.', message.channel);
    }

    // Fetch the giveaway message to get new reactions
    let giveawayMessage = await message.channel.fetchMessage(args.reroll);

    // Check if it's a valid giveaway message
    if (giveawayMessage.author.id !== Kara.user.id || giveawayMessage.embeds.length !== 1 || !giveawayMessage.embeds[0].author.name.startsWith('GIVEAWAY')) return;

    let giveawayItem = giveawayMessage.embeds[0].title;
    let reaction = giveawayMessage.reactions.filter(reaction => reaction.me).first();
    if (!reaction) return;
    reaction = reaction.emoji.name;

    // Get (only) the users who reacted to the giveaway message
    let participants;
    if (giveawayMessage.reactions.has(reaction)) {
      participants = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => `**${u.tag}** / ${u.id}`);
    }

    // Get random users (winners) from the participants
    let winners;
    if (participants.length) {
      winners = Kara.methods.getRandomElements(participants, args.winners, true);
    }

    // If there're winners declare the result
    if (winners) {
      // Declare the result in the channel
      await giveawayMessage.edit({
        embed: {
          color: Kara.colors.BLUE,
          author: {
            name: 'GIVEAWAY Rerolled!'
          },
          title: giveawayItem,
          description: `The following users have won and will be contacted by ${message.author.tag} with their reward.\nThank you everyone for participating. Better luck next time.`,
          fields: [
            {
              name: 'Winners',
              value: winners.join('\n')
            }
          ],
          footer: {
            text: `Giveaway ID: ${giveawayMessage.id}`
          }
        }
      }).catch(e => {
        if (e.code !== 50001) {
          throw e;
        }
      });
    }
    // Otherwise state the unfortunate outcome
    else {
      await giveawayMessage.edit({
        embed: {
          color: Kara.colors.RED,
          title: 'Giveaway Event Rerolled',
          description: `Unfortunately, no one participated and apparently there's no winner for **${giveawayItem}**. 😕`,
          footer: {
            text: `Giveaway ID: ${giveawayMessage.id}`
          }
        }
      }).catch(e => {
        if (e.code !== 50001) {
          throw e;
        }
      });
    }
  }
  else if (args.end) {
    if (message.guild.giveaways.has(args.end)) {
      // Clear the giveaway timeout
      Kara.clearTimeout(message.guild.giveaways.get(args.end));

      // Remove the giveaway details from cache
      message.guild.giveaways.delete(args.end);

      // Delete the giveaway message
      let giveawayMessage = await message.channel.fetchMessage(args.end);
      await giveawayMessage.delete().catch(() => {});

      await message.channel.send({
        embed: {
          color: Kara.colors.RED,
          title: 'Giveaway Cancelled',
          description: `The giveaway event with ID **${args.end}** has been cancelled by ${message.author.tag}`
        }
      }).catch(e => {
        Kara.log.error(e);
      });
    }
    else {
      return Kara.emit('error', '', 'There\'s no giveaway running in this server for the specified ID.', message.channel);
    }
  }
  else {
    return Kara.emit('commandUsage', message, this.help);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'item', type: String, multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 3 },
    { name: 'winners', type: Number, alias: 'w', defaultValue: 1 },
    { name: 'reroll', type: String, alias: 'r' },
    { name: 'end', type: String, alias: 'e' }
  ],
  ownerOnly: false
};

exports.help = {
  name: 'giveaway',
  description: 'Starts a giveaway event, with the item of your choice, for the given amount of time, a winner is chosen at random after the event is concluded. Event can run for at least 1 hour and at most 12 hours.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'giveaway < GIVEAWAY ITEM NAME [-t TIMEOUT_IN_HOURS] [--winners COUNT] | --reroll GIVEAWAY_MESSAGE_ID |--end GIVEAWAY_MESSAGE_ID >',
  example: [ 'giveaway Awesome Goodies! -t 2', 'giveaway Kara T-Shirt --winners 5', 'giveaway --reroll 133174241744538617', 'giveaway --end 153174267544338344' ]
};
