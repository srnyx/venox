const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "play a song",
  options: [
    {
      name: "query",
      description: "title of the song",
      type: "STRING",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const query = interaction.options.getString("query");

    if (!interaction.member.voice.channel)
      return interaction.followUp({
        content: "Join a voice channel first!",
      });

    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });//.then(x => x.tracks[0]);
    //if (!track) return await interaction.followUp({ content: `Song **${query}** not found :(` });

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);
      
const song = await searchResult.then(x => x.tracks[0]);

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    interaction.followUp({
      content: `Playing \`${capitalizeFirstLetter(song.title)}\` :musical_note:`,
    });


    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);

    if (!queue.playing) await queue.play();

  },
};