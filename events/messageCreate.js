const { EmbedBuilder } = require('discord.js');

const userMessages = new Map();

// 🎯 NEW CHAT CHANNEL
const CHAT_CHANNEL_ID = "1470128962284949525";

module.exports = {
  name: 'messageCreate',

  async execute(message) {

    if (message.author.bot) return;

    // =========================
    // 🎯 ONLY WORK IN THIS CHANNEL
    // =========================
    if (message.channel.id !== CHAT_CHANNEL_ID) return;

    // =========================
    // 🚫 BLOCK LINKS
    // =========================
    const linkRegex = /(https?:\/\/|www\.|discord\.gg|\.com|\.net|\.org)/i;

    if (linkRegex.test(message.content)) {
      await message.delete().catch(() => {});

      return message.channel.send({
        content: `${message.author} ❌ Links are not allowed here!`
      }).then(msg => setTimeout(() => msg.delete().catch(()=>{}), 3000));
    }

    // =========================
    // 🔥 ANTI SPAM
    // =========================
    const now = Date.now();
    const data = userMessages.get(message.author.id) || {
      count: 0,
      last: now
    };

    data.count++;
    data.last = now;

    userMessages.set(message.author.id, data);

    if (data.count >= 5) {
      await message.delete().catch(() => {});

      return message.channel.send({
        content: `${message.author} 🚫 Stop spamming!`
      }).then(msg => setTimeout(() => msg.delete().catch(()=>{}), 3000));
    }

    setTimeout(() => {
      userMessages.delete(message.author.id);
    }, 5000);

    // =========================
    // 📡 IP RESPONSE
    // =========================
    if (message.content.toLowerCase() === "ip") {

      const embed = new EmbedBuilder()
        .setTitle("🔱 Devonis Family Server")
        .setColor("#8A2BE2")

        .setDescription(
          `🚧 **Minecraft Server Status:**\n` +
          `> Coming Soon...\n\n` +

          `🌐 **Host:**\n` +
          `> Coming Soon...\n\n` +

          `📢 Stay tuned for updates!\n` +
          `🔥 Big things are coming.`
        )

        .setFooter({ text: "🔱 Powered by Devonis Family" });

      return message.channel.send({
        embeds: [embed]
      });
    }
  }
};

