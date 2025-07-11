const { Client, Events, SlashCommandBuilder, AllowedMentionsTypes } = require('discord.js');
const { 
    V2ComponentBuilder, 
    V2TextDisplay, 
    V2ContainerBuilder, 
    V2UserSelectBuilder, 
    V2ActionRowBuilder, 
    V2RoleSelectBuilder, 
    V2MentionableSelectBuilder, 
    V2ChannelSelectBuilder, 
    V2Separator }
     = require('v2componentsbuilder');
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

require('dotenv').config();

const token = process.env.TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;
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
        new SlashCommandBuilder()
            .setName("rules")
            .setDescription("Auto generates the rules of a server."),
        new SlashCommandBuilder()
            .setName("webhook")
            .setDescription("sends a message in a channel")
            .addStringOption(option =>
                option.setName("message")
                    .setDescription("The message to send")
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("user")
                    .setDescription("The name of the user to send the message as.")
                    .setRequired(true)
            ),
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

    if (interaction.commandName === "rules") {
        await interaction.reply("This command has been removed.");
    }

    if (interaction.commandName === "webhook") {
        const request = new FormData();
        const message = interaction.options.getString("message");
        const user = interaction.options.getString("user");

        request.append('content', message);
        request.append('username', user);
        
        axios.post(webhookUrl, request, {
          headers: request.getHeaders()
        })
        .then(() => interaction.reply("Message Sent!"))
        .catch(err => interaction.reply(`Error: ${err}`));
    }
});

client.login(token);

// simple web server to keep render hosting up and check if bot is up

app.get('/', (req, res) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});