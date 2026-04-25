const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const CHANNEL_ID = 'UC97gtviq7upyXtn0y_Zb-gw';
const CHANNEL_NAME = "Devonis Family";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Show Devonis Family YouTube channel'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle(`📺 ${CHANNEL_NAME}`)
      .setURL(`https://youtube.com/@devonisfamily`)
      .setColor("#FF0000")
      .setDescription("🔗 Click to visit the channel")
      .setThumbnail("https://yt3.googleusercontent.com/xd-d_00ELc31AB6BPBlnBQXXL0ULn3vycEKD6ZjRYAFUc8OnhLjMM1l3rUGX58c9qDOnZQiM9w=s160-c-k-c0x00ffffff-no-rj")
      .setImage("https://yt3.googleusercontent.com/1PjRztjw2A7wcyXykm1-cv58Kpj9hcE3p15a1V88uURr8mMXwRli87KUbeuD916l_XtWhVVSKA=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj")
      .setFooter({ text: "🔱 Powered by Devonis Family" });

    await interaction.reply({ embeds: [embed] });
  }
};
