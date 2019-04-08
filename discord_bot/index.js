const { Client } = require('discord.js');
const config = require('./config.json');
const client=new Client();
client.login(config.botToken);
require('./bot.js')(client, config)