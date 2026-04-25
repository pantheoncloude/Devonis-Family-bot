const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// 🕒 TIME PARSER
function parse(t) {
  const n = parseInt(t);
  if (isNaN(n)) return null;

  if (t.endsWith('s')) return n * 1000;
  if (t.endsWith('m')) return n * 60000;
  if (t.endsWith('h')) return n * 3600000;
  if (t.endsWith('d')) return n * 86400000;

  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dk-giveaway')
    .setDescription('🔱 Start a Devonis Family giveaway')

    .addStringOption(o =>
      o.setName('duration')
        .setDescription('10s / 5m / 1h / 1d')
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName('prize')
        .setDescription('Giveaway reward')
        .setRequired(true)
    )

    .addIntegerOption(o =>
      o.setName('winners')
        .setDescription('Number of winners')
        .setMinValue(1)
        .setMaxValue(10)
    )

    .addChannelOption(o =>
      o.setName('channel')
        .setDescription('Target channel')
    ),

  async execute(interaction, client) {

    const duration = parse(interaction.options.getString('duration'));
    const prize = interaction.options.getString('prize');
    const winnersCount = interaction.options.getInteger('winners') || 1;
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (!duration) {
      return interaction.reply({
        content: "❌ Invalid time (use 10s / 5m / 1h / 1d)",
        ephemeral: true
      });
    }

    const end = Date.now() + duration;
    const endTimestamp = Math.floor(end / 1000);

    // 🔱 BRAND COLOR (Purple/Gold vibe)
    const COLOR = "#8A2BE2";

    const embed = new EmbedBuilder()
      .setTitle("🔱 DEVONIS Family GIVEAWAY")
      .setColor(COLOR)
      .setDescription(
        `🎁 **Reward:** ${prize}\n\n` +
        `⏳ Ends: <t:${endTimestamp}:R>\n` +
        `📅 Exact: <t:${endTimestamp}:F>\n\n` +
        `👥 Entries: 0\n` +
        `🏆 Winners: ${winnersCount}\n\n` +
        `👇 Smash the button to enter`
      )
      .setFooter({ text: `🔱 Powered by Devonis Family • Host: ${interaction.user.username}` })
      .setTimestamp(end);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('dk_join')
        .setLabel('Join Giveaway')
        .setEmoji('🎯')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: "🔱 Devonis Family giveaway launched!",
      ephemeral: true
    });

    const msg = await channel.send({
      embeds: [embed],
      components: [row]
    });

    client.giveaways.set(msg.id, {
      users: new Set(),
      ended: false
    });

    // 🔁 LIVE UPDATE
    const interval = setInterval(async () => {
      const g = client.giveaways.get(msg.id);
      if (!g || g.ended) return clearInterval(interval);

      const updated = new EmbedBuilder()
        .setTitle("🔱 LIVE GIVEAWAY")
        .setColor(COLOR)
        .setDescription(
          `🎁 **Reward:** ${prize}\n\n` +
          `⏳ Ends: <t:${endTimestamp}:R>\n` +
          `📅 Exact: <t:${endTimestamp}:F>\n\n` +
          `👥 Entries: ${g.users.size}\n` +
          `🏆 Winners: ${winnersCount}\n\n` +
          `👇 Enter before it's too late`
        )
        .setFooter({ text: "🔱 Powered by Devonis Family" })
        .setTimestamp(end);

      msg.edit({ embeds: [updated] }).catch(() => {});
    }, 5000);

    // ⏹️ END
    setTimeout(async () => {
      clearInterval(interval);

      const g = client.giveaways.get(msg.id);
      if (!g) return;

      g.ended = true;

      const shuffled = [...g.users].sort(() => 0.5 - Math.random());
      const winners = shuffled.slice(0, winnersCount);

      const winnerText = winners.length
        ? winners.map(id => `<@${id}>`).join(', ')
        : "No one joined 💀";

      const endEmbed = new EmbedBuilder()
        .setTitle("🔱 GIVEAWAY FINISHED")
        .setColor(winners.length ? "#FFD700" : "#FF0000")
        .setDescription(
          `🎁 **Reward:** ${prize}\n\n` +
          `🏆 Winners: ${winnerText}`
        )
        .setFooter({ text: "🔱 Powered by Devonis Family" })
        .setTimestamp();

      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('dk_end')
          .setLabel('Ended')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );

      await msg.edit({
        embeds: [endEmbed],
        components: [disabledRow]
      });

      if (winners.length) {
        await channel.send(`🔱 ${winnerText} won **${prize}**!`);
      }

    }, duration);
  }
};

