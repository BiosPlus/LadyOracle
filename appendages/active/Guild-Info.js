const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {

        let information = new Discord.RichEmbed()
        .setTitle("Guild Information")
        .setFooter("Information is correct as of: " + message.createdTimestamp + " (Epoch Time)")
        .setColor("#e3e3e3")
        .setThumbnail(message.guild.iconURL)
        .addField("Guild Name", message.guild.name)
        .addField("Owner:", message.guild.owner)
        .addField("Established on:", message.guild.createdAt)
        .addField("Member Count: ",message.guild.memberCount)
        .addField("Region: ", message.guild.region);

        message.channel.send(information);
    }

module.exports.help = {
    name: "Guildinfo"
}