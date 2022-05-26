const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('generate')
        .setDescription('Generate QR code')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to encode')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Embed color in hex format')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('image-width')
                .setDescription('Image width')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('image-height')
                .setDescription('Image height')
                .setRequired(false)
        ),
    async execute(interaction) {
        const options = {
            data: interaction.options.getString('text'),
            color: interaction.options.getString('color') || '#0000ff',
            imageWidth: interaction.options.getInteger('image-width') || 200,
            imageHeight: interaction.options.getInteger('image-height') || 200,
        };

        if (options.imageHeight * options.imageWidth > 300000) {
            await interaction.reply('QR Code is too big.');
            return;
        }

        const generatedURL = `https://chart.googleapis.com/chart?chs=${options.imageWidth}x${options.imageHeight}&cht=qr&chl=${encodeURI(options.data)}&choe=UTF-8`;
        const embed = new MessageEmbed().setTitle('Generated QR code')
            .addFields({
                name: 'Encoded text',
                value: options.data
            },
                {
                    name: 'Url',
                    value: generatedURL
                })
            .setColor(options.color)
            .setImage(generatedURL)
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    }
};