const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const express = require('express');
const app = express();
const Discord = require("discord.js");
//const client = new Discord.Client({ ws: { intents: 32509 }));
/*const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add(
    Intents.FLAGS.GUILD_PRESENCES, 
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING
             );*/

//const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_INTEGRATIONS", /*"GUILD_MEMBERS", "GUILD_PRESENCES",*/ "GUILD_WEBHOOKS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING"] }); //new Client({ intents: myIntents });

/*const bot = new Discord.Client({
    intents: 32767,
});
*/
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        /*await client.guilds.cache
            .get("879734848946847774")
            .commands.set(arrayOfSlashCommands);*/

        // Register for all the guilds the client is in
        await client.application.commands.set(arrayOfSlashCommands);
    });

};