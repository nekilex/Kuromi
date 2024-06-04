// main.js
const { Client, IntentsBitField } = require('discord.js');
const { ready } = require('./events/ready');
const sqlite3 = require('sqlite3').verbose();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ]
});

require('dotenv').config();
const token = process.env.TOKEN;

const db = new sqlite3.Database('database.db');

const tables = [
  { name: 'banlist', schema: 'banned_user_id INTEGER PRIMARY KEY NOT NULL, banned_by_user_id INTEGER NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, guild_id INTEGER NOT NULL' },
  { name: 'timeoutlist', schema: 'timed_out_user_id INTEGER PRIMARY KEY NOT NULL, timed_out_by_user_id INTEGER NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, guild_id INTEGER NOT NULL' }
];

tables.forEach((table) => {
  db.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.schema})`, (err) => {
    if (err) {
      console.error(`Error creating table ${table.name}: ${err.message}`);
    } else {
      console.log(`Table ${table.name} created successfully.`);
    }
  });
});

client.once('ready', () => { ready(client); });

client.on('messageCreate', message => { require('./events/messageCreate')(message, db); });

client.login(token);
