const Parser = require('rss-parser');
const parser = new Parser();

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {

    console.log(`🔱 Logged in as ${client.user.tag}`);

    let lastVideo = null;

    setInterval(async () => {
      try {

        const feed = await parser.parseURL(
          "https://www.youtube.com/feeds/videos.xml?channel_id=UC97gtviq7upyXtn0y_Zb-gw"
        );

        if (!feed.items || feed.items.length === 0) return;

        const latest = feed.items[0];

        // ⛔ Skip first run
        if (!lastVideo) {
          lastVideo = latest.id;
          return;
        }

        if (latest.id !== lastVideo) {
          lastVideo = latest.id;

          // 📢 DISCORD CHANNEL
          const channel = client.channels.cache.get("1467154654252105870");

          if (!channel) return console.log("❌ Invalid channel ID");

          const videoId = latest.id.split(':')[2];

          await channel.send({
            content: "🚨 **NEW VIDEO DROPPED!** <@&YOUR_ROLE_ID>", // optional role ping
            embeds: [
              {
                title: `📺 ${latest.title}`,
                url: latest.link,
                color: 0xFF0000,

                description:
                  `🔥 A new video just went live!\n\n` +
                  `👉 [Watch Now](${latest.link})\n\n` +
                  `📌 Don’t forget to like & subscribe`,

                image: {
                  url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                },

                footer: {
                  text: "🔱 Powered by Devonis Family"
                },

                timestamp: new Date()
              }
            ]
          });

          console.log("✅ YouTube notification sent");
        }

      } catch (err) {
        console.log("YouTube Error:", err.message);
      }
    }, 300000); // every 5 minutes
  }
};

