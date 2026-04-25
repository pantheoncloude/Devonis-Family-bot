require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];

// 🔥 LOAD ONLY .js FILES
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);

    if (!command.data || !command.execute) {
      console.log(`❌ Skipping ${file} (invalid structure)`);
      continue;
    }

    commands.push(command.data.toJSON());
    console.log(`✅ Loaded ${file}`);

  } catch (err) {
    console.error(`❌ Error in ${file}:`, err.message);
  }
}

// 🔥 REST
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// 🔥 DEPLOY
(async () => {
  try {
    console.log('🚀 Deploying commands...');

    // ⚡ USE GUILD FOR FAST UPDATE
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID // add this in .env
      ),
      { body: commands }
    );

    console.log('✅ Commands deployed (guild)');

  } catch (error) {
    console.error('❌ Deployment error:', error);
  }
})();

