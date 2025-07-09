const { SlashCommandBuilder } = require('discord.js');
const { V2ComponentBuilder, V2TextDisplay, V2ContainerBuilder, V2UserSelectBuilder, V2ActionRowBuilder, V2RoleSelectBuilder, V2MentionableSelectBuilder, V2ChannelSelectBuilder, V2Separator } = require('v2componentsbuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testing")
        .setDescription("Testing the V2 components."),
    
    async execute(interaction) {
        const components = new V2ComponentBuilder().setComponents([
            new V2ContainerBuilder()
                .setComponents([
                    new V2TextDisplay("Testing")
                ])
                .setColor(1146986)
        ]);

        return interaction.reply(components.toJSON);
    }
}