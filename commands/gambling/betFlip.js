/**
 * @file betFlip command
 * @author Kara
 * @license GPL-3.0
 */

let recentUsers = [];

exports.exec = async (Bastion, message, args) => {
  let cooldown = 60;

  if (recentUsers.includes(message.author.id)) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'gamblingCooldown', message.author, cooldown), message.channel);
  }

  if (!args.money || args.money < 1 || !/^(heads|tails)$/i.test(args.outcome)) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.money = parseInt(args.money);

  let minAmount = 5;
  if (args.money < minAmount) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'minBet', minAmount), message.channel);
  }

  let outcomes = [
    'Heads',
    'Tails'
  ];
  let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  let guildMemberModel = await message.client.database.models.guildMember.findOne({
    attributes: [ 'bastionCurrencies' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });

  guildMemberModel.dataValues.bastionCurrencies = parseInt(guildMemberModel.dataValues.bastionCurrencies);

  if (args.money > guildMemberModel.dataValues.bastionCurrencies) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'insufficientBalance', guildMemberModel.dataValues.bastionCurrencies), message.channel);
  }

  recentUsers.push(message.author.id);

  let result;
  if (outcome.toLowerCase() === args.outcome.toLowerCase()) {
    let prize = args.money < 50 ? args.money + outcomes.length : args.money < 100 ? args.money : args.money * 1.5;
    result = `Congratulations! You won the bet.\nYou won **${prize}** $.`;

    Bastion.emit('userDebit', message.member, prize);
  }
  else {
    result = 'Sorry, you lost the bet. Better luck next time.';

    Bastion.emit('userCredit', message.member, args.money);
  }

  setTimeout(() => {
    recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
  }, cooldown * 1000);

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: `Flipped ${outcome}`,
      description: result
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'bf' ],
  enabled: true,
  argsDefinitions: [
    { name: 'outcome', type: String, alias: 'o', defaultOption: true },
    { name: 'money', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'betFlip',
  description: 'Bet %currency.name_plural% on prediction of the outcome of flipping a coin. If you win, you get more of it. But if you lose, you lose the amount you have bet.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'betflip < heads/tails > <-m amount>',
  example: [ 'betflip heads -m 100' ]
};
