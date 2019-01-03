/**
 * @file race command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const ProgressBar = xrequire('./utils/progress');

exports.exec = async (Bastion, message) => {
  let racers = [ [], [] ];
  const STEPS = 20;
  for (let i = 0; i < racers.length; i++) {
    racers[i].length = STEPS;
    for (let j = 0; j < STEPS; j++) {
      racers[i][j] = '-\u2003';
    }
  }

  const bastion = new ProgressBar(':bar', {
    incomplete: '-\u2003',
    complete: '-\u2003',
    head: '🚘',
    total: 20
  });
  const racer = new ProgressBar(':bar', {
    incomplete: '-\u2003',
    complete: '-\u2003',
    head: '🚖',
    total: 20
  });

  let raceStatusMessage = await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Race',
      fields: [
        {
          name: Bastion.user.tag,
          value: `:vertical_traffic_light: ${racers[0].join('')}:checkered_flag:`
        },
        {
          name: message.author.tag,
          value: `:vertical_traffic_light: ${racers[1].join('')}:checkered_flag:`
        }
      ]
    }
  });

  let timer = setInterval(() => {
    for (let i = 0; i < Number.random(1, 5); i++) {
      racer.tick();
    }
    for (let i = 0; i < Number.random(1, 5); i++) {
      bastion.tick();
    }

    if (bastion.lastDraw) {
      let result = 'Race ',
        progressKara = `:vertical_traffic_light: ${bastion.lastDraw}:checkered_flag:`,
        progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag:`;

      if (bastion.complete && !racer.complete) {
        result += 'Ended';
        progressKara = `:vertical_traffic_light: ${bastion.lastDraw}:checkered_flag: :trophy:`;
      }
      else if (!bastion.complete && racer.complete) {
        result += 'Ended';
        progressRacer = `:vertical_traffic_light: ${racer.lastDraw}:checkered_flag: :trophy:`;
      }
      else if (bastion.complete && racer.complete) {
        result += 'Ended - Draw';
      }

      raceStatusMessage.edit({
        embed: {
          color: Bastion.colors.BLUE,
          title: result,
          fields: [
            {
              name: Bastion.user.tag,
              value: progressKara
            },
            {
              name: message.author.tag,
              value: progressRacer
            }
          ]
        }
      }).catch(() => {});
    }
    if (bastion.complete || racer.complete) {
      clearInterval(timer);
    }
  }, 1000);
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'race',
  description: 'Start a race against %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'race',
  example: [ 'race' ]
};
