/**
 * @file scheduledCommandHandler
 * @author Kara
 * @license GPL-3.0
 */

const CronJob = xrequire('cron').CronJob;
const parseArgs = xrequire('command-line-args');

/**
 * Handles Kara's scheduled commands
 * @param {Kara} Kara Kara Discord client object
 * @returns {void}
 */
module.exports = Kara => {
  setTimeout(async () => {
    try {
      let scheduledCommandModel = await Kara.database.models.scheduledCommand.findAll({
        attributes: [ 'channelID', 'messageID', 'cronExp', 'command', 'arguments' ]
      });

      if (!scheduledCommandModel.length) return;

      for (let i = 0; i < scheduledCommandModel.length; i++) {
        let cronExp = scheduledCommandModel[i].dataValues.cronExp,
          command = scheduledCommandModel[i].dataValues.command.toLowerCase(), cmd,
          channel = Kara.channels.get(scheduledCommandModel[i].dataValues.channelID);
        if (!channel) {
          removeScheduledCommandByChannelID(Kara, scheduledCommandModel[i].dataValues.channelID);
          continue;
        }
        let args = scheduledCommandModel[i].dataValues.arguments ? scheduledCommandModel[i].dataValues.arguments.split(' ') : '';

        let job = new CronJob(cronExp,
          async function () {
            let message = await channel.fetchMessage(scheduledCommandModel[i].dataValues.messageID).catch(e => {
              if (e.toString().includes('Unknown Message')) {
                job.stop();
                removeScheduledCommandByMessageID(Kara, scheduledCommandModel[i].dataValues.messageID);
              }
              else {
                Kara.log.error(e);
              }
            });

            if (Kara.commands.has(command)) {
              cmd = Kara.commands.get(command);
            }
            else if (Kara.aliases.has(command)) {
              cmd = Kara.commands.get(Kara.aliases.get(command).toLowerCase());
            }
            else {
              job.stop();
              return removeScheduledCommandByCommandName(Kara, command);
            }

            if (cmd.config.enabled) {
              cmd.exec(Kara, message, parseArgs(cmd.config.argsDefinitions, { argv: args, partial: true }));
            }
          },
          function () {},
          false // Start the job right now
        );
        job.start();
      }
    }
    catch (e) {
      Kara.log.error(e);
    }
  }, 5 * 1000);
};

/**
 * Removes Kara's scheduled commands
 * @param {Kara} Kara Kara Discord client object
 * @param {String} channelID The Snowflake ID of the channel where the command is scheduled
 * @returns {void}
 */
function removeScheduledCommandByChannelID(Kara, channelID) {
  Kara.database.models.scheduledCommand.destroy({
    where: {
      channelID: channelID
    }
  }).catch(e => {
    Kara.log.error(e);
  });
}

/**
 * Removes Kara's scheduled commands
 * @param {Kara} Kara Kara Discord client object
 * @param {String} messageID The Snowflake ID of the message that holds the scheduled command's info
 * @returns {void}
 */
function removeScheduledCommandByMessageID(Kara, messageID) {
  Kara.database.models.scheduledCommand.destroy({
    where: {
      messageID: messageID
    }
  }).catch(e => {
    Kara.log.error(e);
  });
}

/**
 * Removes Kara's scheduled commands
 * @param {Kara} Kara Kara Discord client object
 * @param {String} commandName The name of the command that is scheduled
 * @returns {void}
 */
function removeScheduledCommandByCommandName(Kara, commandName) {
  Kara.database.models.scheduledCommand.destroy({
    where: {
      command: commandName
    }
  }).catch(e => {
    Kara.log.error(e);
  });
}
