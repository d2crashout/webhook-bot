const { Client, Events, SlashCommandBuilder } = require('discord.js');
const { token } = require('./config.json');
const {
    V2ComponentBuilder,
    V2TextDisplay,
    V2ContainerBuilder,
} = require('v2componentsbuilder');

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
