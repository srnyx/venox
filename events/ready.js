const bot = require("../index");

bot.on("ready", () =>
    console.log(`${bot.user.tag} is up and ready to go! Also I like cookies :)`)
);


bot.on("ready", async() => {
    
    const servers = await bot.guilds.cache.size;
    const servercount = await bot.guilds.cache.reduce((a,b) => a+b.memberCount, 0);
    
    bot.user.setActivity({
        status: 'idle',
        game: {
            name: 'a video',
            type: 'WATCHING'
         }
      });
    
    /*
    const messages = [
        `Owned by srnyx & ChrizxzFTW`,
        `Join the network: dsc.gg/venoxnet`,
        `Watching ${servers} servers and ${servercount} members!`
    ]

    setInterval(() => {
        const status = messages[Math.floor(Math.random()*messages.length)]
        bot.user.setActivity({ messages : [{name : `${status}`}]})
    }, 5000);
    */
  });