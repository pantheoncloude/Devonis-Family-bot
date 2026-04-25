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
      console.log(`✅ Loaded command: ${file}`);

    } catch (err) {
      console.error(`❌ Command error (${file}):`, err.message);
    }
  }
}

// =======================
// ✅ LOAD EVENTS
// =======================
if (fs.existsSync('./events')) {
  const files = fs.readdirSync('./events').filter(f => f.endsWith('.js'));

  for (const file of files) {
    try {
      const ev = require(`./events/${file}`);

      if (!ev.name || !ev.execute) {
        console.log(`❌ Skipping ${file}`);
        continue;
      }

      client.on(ev.name, (...args) => ev.execute(...args, client));
      console.log(`✅ Loaded event: ${file}`);

    } catch (err) {
      console.error(`❌ Event error (${file}):`, err.message);
    }
  }
}

// =======================
// 🔥 READY
// =======================
client.once('ready', async () => {
  console.log(`🔱 ${client.user.tag} is ONLINE`);

  let lastVideo = null;

  // 📁 Load last video from file
  if (fs.existsSync('./lastVideo.txt')) {
    lastVideo = fs.readFileSync('./lastVideo.txt', 'utf8');
  }

  setInterval(async () => {
    try {
      const feed = await parser.parseURL(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.YOUTUBE_CHANNEL_ID}`
      );

      if (!feed.items.length) return;

      const latest = feed.items[0];

      if (!lastVideo) {
        lastVideo = latest.id;
        fs.writeFileSync('./lastVideo.txt', lastVideo);
        return;
      }

      if (latest.id !== lastVideo) {
        lastVideo = latest.id;
        fs.writeFileSync('./lastVideo.txt', lastVideo);

        const channel = await client.channels.fetch(process.env.YT_CHANNEL).catch(() => null);

        if (!channel) {
          console.log("❌ YT channel not found");
          return;
        }

        const videoId = latest.id.split(':').pop();

        const embed = new EmbedBuilder()
          .setTitle("📺 New Video Uploaded!")
          .setColor("#FF0000")
          .setDescription(`🎬 **${latest.title}**\n\n👉 [Watch Now](${latest.link})`)
          .setImage(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
          .setFooter({ text: "🔱 Powered by Devonis King" })
          .setTimestamp();

        await channel.send({
          content: "<@&YOUR_ROLE_ID> 🚨 NEW VIDEO!", // 🔥 replace with role
          embeds: [embed]
        });

        console.log("✅ YouTube notification sent");
      }

    } catch (err) {
      console.error("❌ YouTube error:", err.message);
    }
  }, 300000); // 5 min
});

// =======================
// 🚀 LOGIN
// =======================
client.login(process.env.TOKEN)
  .catch(err => console.error("❌ Login failed:", err.message));


