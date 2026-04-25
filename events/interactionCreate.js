const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

// 🔒 ACTIVE TICKETS
const activeTickets = new Map();

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // =========================
    // ⚙️ COMMAND HANDLER
    // =========================
    if (interaction.isChatInputCommand()) {
      const cmd = client.commands.get(interaction.commandName);
      if (cmd) return cmd.execute(interaction, client);
    }

    // =========================
    // 🔘 BUTTON HANDLER
    // =========================
    if (interaction.isButton()) {

      // 🎉 GIVEAWAY (UPDATED ID)
      if (interaction.customId === 'dk_join') {

        const g = client.giveaways.get(interaction.message.id);

        if (!g || g.ended) {
          return interaction.reply({ content: "❌ Giveaway ended", ephemeral: true });
        }

        if (g.users.has(interaction.user.id)) {
          g.users.delete(interaction.user.id);
          return interaction.reply({
            content: "❌ You left the giveaway",
            ephemeral: true
          });
        }

        g.users.add(interaction.user.id);
        return interaction.reply({
          content: "✅ You joined the giveaway",
          ephemeral: true
        });
      }

      // =========================
      // 📊 POLL SYSTEM (UPGRADED)
      // =========================
      if (interaction.customId.startsWith('poll_')) {

        const [, pollId, index] = interaction.customId.split('_');
        const poll = client.polls.get(pollId);

        if (!poll || poll.ended) {
          return interaction.reply({ content: "❌ Poll ended", ephemeral: true });
        }

        const userId = interaction.user.id;

        // 🔄 REMOVE OLD VOTE
        if (poll.userVotes?.has(userId)) {
          const prev = poll.userVotes.get(userId);
          poll.votes[prev].delete(userId);
        }

        // ✅ ADD NEW VOTE
        poll.votes[index].add(userId);
        poll.userVotes?.set(userId, index);

        return interaction.reply({
          content: `✅ Voted for option ${parseInt(index) + 1}`,
          ephemeral: true
        });
      }

      // =========================
      // ❌ CLOSE TICKET
      // =========================
      if (interaction.customId === 'ticket_close') {

        const channel = interaction.channel;

        const userId = [...activeTickets.entries()]
          .find(([_, ch]) => ch === channel.id)?.[0];

        if (userId) activeTickets.delete(userId);

        await interaction.reply({
          content: "🔒 Closing ticket in 3 seconds...",
          ephemeral: false
        });

        setTimeout(() => {
          channel.delete().catch(() => {});
        }, 3000);
      }
    }

    // =========================
    // 🎟️ SELECT MENU (TICKET)
    // =========================
    if (interaction.isStringSelectMenu()) {

      if (interaction.customId === 'dk_ticket_menu') {

        const type = interaction.values[0];
        const user = interaction.user;

        // ❌ ONE TICKET LIMIT
        if (activeTickets.has(user.id)) {
          return interaction.reply({
            content: "❌ You already have an active ticket",
            ephemeral: true
          });
        }

        // 📂 CHANGE THIS → YOUR SUPPORT CATEGORY ID
        const CATEGORY_ID = process.env.TICKET_CATEGORY;

        const channel = await interaction.guild.channels.create({
          name: `ticket-${type}-${user.username}`,
          type: ChannelType.GuildText,
          parent: CATEGORY_ID || null,

          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
              ]
            }
          ]
        });

        activeTickets.set(user.id, channel.id);

        const embed = new EmbedBuilder()
          .setTitle(`🔱 ${type.toUpperCase()} TICKET`)
          .setColor("#8A2BE2")
          .setDescription(
            `👋 Hello ${user},\n\n` +
            `Our team will assist you shortly.\n\n` +
            `📌 **Category:** ${type}\n` +
            `⏳ Please explain your issue clearly.`
          )
          .setFooter({ text: "🔱 Powered by Devonis Family" });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          content: `${user}`, // ping only user, not everyone
          embeds: [embed],
          components: [row]
        });

        return interaction.reply({
          content: `✅ Ticket created: ${channel}`,
          ephemeral: true
        });
      }
    }
  }
};
