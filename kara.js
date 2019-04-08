/**
 * @file The starting point of Kara
 * @author Kara
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const KARA = new Tesseract.Client({
  settingsDirectory: './settings',
  monitorsDirectory: './monitors',
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

if (KARA.shard) process.title = `Kara-Shard-${KARA.shard.id}`;
else process.title = 'KaraBot';

KARA.package = xrequire('./package.json');
KARA.Constants = Tesseract.Constants;
KARA.colors = Tesseract.Constants.Colors;
KARA.permissions = Tesseract.Permissions.FLAGS;

xrequire('./prototypes/Number.prototype');
xrequire('./prototypes/Number');
xrequire('./prototypes/String.prototype');
xrequire('./prototypes/Array.prototype');
xrequire('./prototypes/Array');
xrequire('./prototypes/Object');

const WebhookHandler = xrequire('./handlers/webhookHandler.js');
KARA.webhook = new WebhookHandler(KARA.credentials.webhooks);
KARA.log = xrequire('./handlers/logHandler');
KARA.methods = xrequire('./handlers/methodHandler');

const StringHandler = xrequire('./handlers/stringHandler');
KARA.i18n = new StringHandler();

const Sequelize = xrequire('sequelize');
KARA.database = new Sequelize(KARA.credentials.database.URI, {
  operatorsAliases: false,
  logging: false
});
KARA.database.authenticate().then(() => {
  // Populate Database/Implement model definitions
  xrequire('./utils/models')(Sequelize, KARA.database);

  // Load Kara Events
  xrequire('./handlers/eventHandler')(KARA);

  // Load Kara Modules
  const Modules = xrequire('./handlers/moduleHandler');
  KARA.commands = Modules.commands;
  KARA.aliases = Modules.aliases;

  // Start Kara
  KARA.login(KARA.credentials.token).then(() => {
    /**
     * Using <Model>.findOrCreate() won't require the use of
     * <ModelInstance>.save() but <Model>.findOrBuild() is used instead because
     * <Model>.findOrCreate() creates a race condition where a matching row is
     * created by another connection after the `find` but before the `insert`
     * call. However, it is not always possible to handle this case in SQLite,
     * specifically if one transaction inserts and another tries to select
     * before the first one has committed. TimeoutError is thrown instead.
     */
    KARA.database.models.settings.findOrBuild({
      where: {
        botID: KARA.user.id
      }
    }).spread((settingsModel, initialized) => {
      if (initialized) {
        return settingsModel.save();
      }
    }).catch(KARA.log.error);
  }).catch(e => {
    KARA.log.error(e.toString());
    process.exit(1);
  });
}).catch(err => {
  KARA.log.error(err);
});

process.on('unhandledRejection', rejection => {
  /* eslint-disable no-console */
  console.warn('\n[unhandledRejection]');
  console.warn(rejection);
  console.warn('[/unhandledRejection]\n');
  /* eslint-enable no-console */
});