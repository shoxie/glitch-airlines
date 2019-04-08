/**
 * @file Test script to test Kara's successful booting
 * @author Kara
 * @license GPL-3.0
 */

const Tesseract = xrequire('tesseract');
const KARA = new Tesseract.Client({
  settingsDirectory: './settings',
  disabledEvents: [
    'USER_NOTE_UPDATE',
    'TYPING_START',
    'RELATIONSHIP_ADD',
    'RELATIONSHIP_REMOVE'
  ]
});

KARA.package = xrequire('./package.json');
KARA.Constants = Tesseract.Constants;
KARA.colors = Tesseract.Constants.Colors;
KARA.permissions = Tesseract.Permissions.FLAGS;

// xrequire('./prototypes/Array.prototype');
xrequire('./prototypes/String.prototype');
xrequire('./prototypes/Number.prototype');

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

  if (KARA.commands && KARA.aliases) {
    KARA.log.info(`Successfully loaded ${KARA.commands.size} commands`);
  }
  else {
    KARA.log.error('Failed to load commands.');
    process.exit(1);
  }
}).catch(e => {
  KARA.log.error(e.stack);
  process.exit(1);
});
