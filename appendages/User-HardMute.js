const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    
    //Grabs first mentioned user, and checks if they're in the guild the message is from, if not, returns "undefined"
    let usertomute = message.guild.member(message.mentions.users.first());
    let muteduration = args[1];
    let channellist = message.guild.channels;

    const listedChannels = [];
    message.guild.channels.forEach(channel => {
        if (channel.permissionsFor(message.author).has('VIEW_CHANNEL')) listedChannels.push(channel.name);
    });
    message.channel.send(`You have access to: ${listedChannels.join(',')}`);

    //Cannot find user
    //if(!usertomute) message.reply("Couldn't find user.");
    //Will not mute mod
    //if(usertomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Will not mute them, they have the Manage Messages permission. Likely a moderator or higher.");

    //Check the ID of the first mentioned member
    //console.log(channellist);
}

module.exports.help = {
    name: "hardmute"
}