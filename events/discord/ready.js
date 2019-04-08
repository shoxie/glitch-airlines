/**
 * @file ready event
 * @author Kara
 * @license GPL-3.0
 */

const COLOR = xrequire('chalk');

module.exports = async Kara => {
  try {
    // Sanity check
    let application = await Kara.fetchApplication();


    Kara.monitors.exec(__filename.slice(__dirname.length + 1, -3), Kara);

    if (Kara.shard && Kara.shard.id + 1 === Kara.shard.count) {
      await Kara.shard.broadcastEval('process.env.SHARDS_READY = true');
    }

    Kara.user.setPresence({
      status: Kara.configurations.status,
      game: {
        name: typeof Kara.configurations.game.name === 'string' ? Kara.configurations.game.name : Kara.configurations.game.name.length ? Kara.configurations.game.name[0] : null,
        type: Kara.configurations.game.type,
        url: Kara.configurations.game.url && Kara.configurations.game.url.trim().length ? Kara.configurations.game.url : null
      }
    });

    if (typeof Kara.configurations.game.name !== 'string' && Kara.configurations.game.name.length) {
      Kara.setInterval(async () => {
        try {
          await Kara.user.setActivity(Kara.configurations.game.name[Math.floor(Math.random() * Kara.configurations.game.name.length)],
            {
              type: Kara.configurations.game.type,
              url: Kara.configurations.game.url && Kara.configurations.game.url.trim().length ? Kara.configurations.game.url : null
            });
        }
        catch (e) {
          Kara.log.error(e);
        }
      }, ((typeof Kara.configurations.game.interval === 'number' && Kara.configurations.game.interval) || 60) * 60 * 1000);
    }

    let bastionGuilds = Kara.guilds.map(g => g.id);
    let guilds = await Kara.database.models.guild.findAll({
      attributes: [ 'guildID' ]
    });
    guilds = guilds.map(guild => guild.guildID);

    /*
     * Add guilds to the DB which was added Kara when it was offline.
     */
    for (let i = 0; i < bastionGuilds.length; i++) {
      let found = false;
      for (let j = 0; j < guilds.length; j++) {
        if (bastionGuilds[i] === guilds[j]) {
          found = true;
          break;
        }
      }
      if (found === false) {
        /**
         * TODO: Use <Model>.bulkCreate() when Sequelize supports bulk ignore
         * option with it, which isn't supported yet because PostgreSQL doesn't
         * support 'INSERT OR IGNORE' query, yet.
         * @example
         * await Kara.database.models.guild.bulkCreate(
         *   Kara.guilds.map(guild => {
         *     return { guildID: guild.id };
         *   }),
         *   { ignore: true }
         * );
         */
        await Kara.database.models.guild.create({
          guildID: bastionGuilds[i]
        },
        {
          fields: [ 'guildID' ]
        });
      }
    }

    /**
     * TODO: Remove guilds from DB which removed Kara when it was offline.
     * @example
     * for (let i = 0; i < guilds.length; i++) {
     *   let found = false;
     *   for (let j = 0; j < bastionGuilds.length; j++) {
     *     if (guilds[i] === bastionGuilds[j]){
     *       found = true;
     *       break;
     *     }
     *   }
     *   if (found === false) {
     *     await Kara.database.models.guild.destroy({
     *       where: {
     *         guildID: guilds[i]
     *       }
     *     });
     *   }
     * }
     */

    xrequire('./handlers/scheduledCommandHandler')(Kara);
    xrequire('./handlers/streamNotifier')(Kara);
    xrequire('./handlers/reactionRolesGroupsHandler')(Kara);

    if (Kara.shard) {
      Kara.log.console(`${COLOR.cyan(`[${Kara.user.username}]:`)} Shard ${Kara.shard.id} is ready with ${Kara.guilds.size} servers.`);

      Kara.webhook.send('bastionLog', {
        title: `Launched Shard ${Kara.shard.id}`,
        description: `Shard ${Kara.shard.id} is ready with ${Kara.guilds.size} servers.`,
        footer: {
          icon_url: 'https://resources.bastionbot.org/images/hourglass_loading.gif',
          text: `Launched ${Kara.shard.id + 1} of ${Kara.shard.count} shards.`
        },
        timestamp: new Date()
      });
    }

    if (!Kara.shard || process.env.SHARDS_READY) {
      let bootTime = Math.floor(process.uptime());
      let guilds = Kara.shard ? await Kara.shard.broadcastEval('this.guilds.size') : Kara.guilds.size;
      if (guilds instanceof Array) {
        guilds = guilds.reduce((sum, val) => sum + val, 0);
      }

      Kara.log.console(COLOR`\n{cyan Kara} v${Kara.package.version}`);
      Kara.log.console(COLOR`{gray ${Kara.package.url}}`);

      Kara.log.console(COLOR`\n{gray </> with ❤ by The Kara Bot Team & Contributors}`);
      Kara.log.console(COLOR`{gray Copyright (C) 2017-2018 The Kara Bot Project}`);

      Kara.log.console(COLOR`\n{cyan [${Kara.user.username}]:} I'm ready to roll! 🚀\n`);

      if (Kara.shard) {
        Kara.log.console(COLOR`{green [   SHARDS]:} ${Kara.shard.count}`);
      }
      Kara.log.console(COLOR`{green [  SERVERS]:} ${guilds}`);
      Kara.log.console(COLOR`{green [   PREFIX]:} ${Kara.configurations.prefix.join(' ')}`);
      Kara.log.console(COLOR`{green [ COMMANDS]:} ${Kara.commands.size}`);
      Kara.log.console(COLOR`{green [BOOT TIME]:} ${bootTime}s`);

      Kara.webhook.send('bastionLog', {
        color: Kara.colors.BLUE,
        title: 'I\'m Ready to Roll!  🚀',
        description: `Connected to ${guilds} servers${Kara.shard ? ` in ${Kara.shard.count} shards` : ''}.`,
        footer: {
          icon_url: 'https://resources.bastionbot.org/logos/Kara_Logomark_C.png',
          text: `Kara v${Kara.package.version}`
        },
        timestamp: new Date()
      });
    }
  }
  catch (e) {
    Kara.log.error(e);
    process.exit(1);
  }
};
