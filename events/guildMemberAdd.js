const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {

    const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("🔱 Welcome to Devonis Family Community")
      .setColor("#8A2BE2")

      .setDescription(
        `👋 Hey ${member}, welcome to the **Devonis Family official server!**\n\n` +

        `📺 **About Us:**\n` +
        `This is the community for **Devonis King YouTube channel** 🎥\n` +
        `Stay connected for content, updates, and future releases.\n\n` +

        `🚀 **Get Started:**\n` +
        `📜 Rules → <#1470128961957662909>\n` +
        `📡 Server Updates → <#1470131103426678917>\n\n` +

        `🎬 **What you get here:**\n` +
        `• YouTube updates & announcements\n` +
        `• Giveaways & events 🎉\n` +
        `• Community chats & support 💬\n` +
        `• Early access to upcoming projects ⚡\n\n` +

        `🧠 **Future Plans:**\n` +
        `A custom Minecraft server may launch soon 👀\n` +
        `Stay active so you don’t miss it.\n\n` +

        `🔥 Be active. Be known. Be part of the journey.`
      )

      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))

      .setFooter({ text: "🔱 Powered by Devonis Family" })

      .setTimestamp();

    channel.send({
      content: `🎉 Welcome ${member}!`,
      embeds: [embed]
    });
  }
};
