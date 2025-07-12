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
            .setName("message")
            .setDescription("sends a message in a channel")
            .addStringOption(option =>
                option.setName("content")
                    .setDescription("The message to send")
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("user")
                    .setDescription("The name of the user to send the message as.")
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("avatar_url")
                    .setDescription("The image URL of the webhook avatar.")
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName("create")
            .setDescription("Creates a new webhook in the specified channel.")
            .addChannelOption(option => 
                option.setName("channel")
                    .setDescription("The channel the webhook will be created in.")
                    .setRequired(true)
            ),
    ]);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "message") {
        const request = new FormData();
        const message = interaction.options.getString("content");
        const user = interaction.options.getString("user");
        const image = interaction.options.getString("avatar_url");

        request.append('content', message);
        request.append('username', user);
        request.append('avatar_url', image);
        
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