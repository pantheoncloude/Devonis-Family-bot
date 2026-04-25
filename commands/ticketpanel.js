const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('🔱 Send ticket panel'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("🔱 DEVONIS Family SUPPORT")
      .setColor("#8A2BE2")
      .setDescription(
        `Welcome to the **Devonis King Support System**\n\n` +
        `📩 Choose a category below to open a ticket.\n\n` +
        `🛠️ **Support** → General help\n` +
        `💰 **Purchase** → Buy ranks / items\n` +
        `🚨 **Report** → Report players/issues\n` +
        `❓ **Other** → Anything else\n\n` +
        `⚠️ Only **1 active ticket** per user\n` +
        `📂 Tickets will be created in the support category`
      )
      .setFooter({ text: "🔱 Powered by Devonis Family" });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('dk_ticket_menu')
      .setPlaceholder('🔽 Select ticket type')
      .addOptions([
        {
          label: 'Support',
          description: 'Get help from staff',
          value: 'support',
          emoji: '🛠️'
        },
        {
          label: 'Purchase',
          description: 'Buy ranks or items',
          value: 'purchase',
          emoji: '💰'
        },
        {
          label: 'Report',
          description: 'Report a player or issue',
          value: 'report',
          emoji: '🚨'
        },
        {
          label: 'Other',
          description: 'General inquiries',
          value: 'other',
          emoji: '❓'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
