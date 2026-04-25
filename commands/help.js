const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show commands'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("📜 Devonis Family Commands")
      .setColor("#8A2BE2") // 🔱 Purple

      .setDescription(`
/embed create  
/embed edit  
/dk-giveaway  
/gexit  
/poll  
/ticketpanel  
/mcstatus  
/ip  
/youtube  
/help
`)

      .setFooter({ text: "🔱 Powered by Devonis Family" });

    await interaction.reply({ embeds: [embed] });
  }
};
