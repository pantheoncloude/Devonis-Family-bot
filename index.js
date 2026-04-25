require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  Events
} = require('discord.js');

const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();
const express = require('express');

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

      client.commands.set(cmd.data.name, cmd);
      console.log(`✅ Loaded command: ${cmd.data.name}`);
    } catch (err) {
      console.error(`❌ Error loading ${file}:`, err);
    }
  }
}

// =======================
// 🤖 BOT READY
// =======================
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// =======================
// ⚡ COMMAND HANDLER
// =======================
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);

  if (!cmd) {
    console.log(`❌ Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await cmd.execute(interaction, client);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '❌ Error executing command',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ Error executing command',
        ephemeral: true
      });
    }
  }
});

// =======================
// 🚀 LOGIN
// =======================
client.login(process.env.TOKEN);
