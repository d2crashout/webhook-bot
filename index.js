const { Client, Events, SlashCommandBuilder } = require('discord.js');
const {
    V2ComponentBuilder,
    V2TextDisplay,
    V2ContainerBuilder,
} = require('v2componentsbuilder');
const express = require('express');

require('dotenv').config();

const token = process.env.TOKEN;
const app = express();
const port = 3000;
const client = new Client({ intents: [] });

client.once(Events.ClientReady, async c => {
    console.log(`Logged in as ${c.user.username}`);

    // Register both commands (ping + testing)
    await client.application.commands.set([
        new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Replies with pong!"),
        new SlashCommandBuilder()
            .setName("testing")
            .setDescription("Testing the V2 components."),
    ]);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (interaction.commandName === "testing") {
        const components = new V2ComponentBuilder().setComponents([
            new V2ContainerBuilder()
                .setComponents([
                    new V2TextDisplay("Testing")
                ])
                .setColor(1146986)
        ]);

        await interaction.reply(components.toJSON());
    }
});

client.login(token);

// simple web server to keep render hosting up

app.get('/', (req, res) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});