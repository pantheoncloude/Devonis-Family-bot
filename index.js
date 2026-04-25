require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder
} = require('discord.js');

const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();
const express = require('express'); // 🔥 added

// 🔥 CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 💾 STORAGE
client.commands = new Collection();
client.giveaways = new Map();
client.polls = new Map();

// =======================
// 🌐 KEEP RENDER ALIVE
// =======================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// =======================
// ✅ LOAD COMMANDS
// =======================
if (fs.existsSync('./commands')) {
  const files = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

  for (const file of files) {
    try {
      const cmd = require(`./commands/${file}`);

      if (!cmd.data || !cmd.execute) {
        console.log(`❌ Skipping ${file}`);
        continue;
      }

      client.commands.set(cmd.data.name, cmd
