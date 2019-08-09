const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    
    //Grabs first mentioned user, and checks if they're in the guild the message is from, if not, returns "undefined"
    let usertomute = message.guild.member(message.mentions.users.first());
    let muteduration = args[1];

    //List for channels the user can send messages in (we don't want to use VIEW_MESSAGES, incase they miss out on news)
    let channellist = [];
    message.guild.channels.forEach(channel => {
        if (channel.permissionsFor(usertomute).has('SEND_MESSAGES')) channellist.push(channel.name);
    });

    let channellistformatted = channellist.join('\r\n');

    //We need a channel for the moderation log, in the event the bot fails it will print a paper trail of what to fix.
    let moderationlogchannel = message.guild.channels.find('name',"ladyoracle-log");
    moderationlogchannel.send("I found  " + usertomute + " [ID:" + `].\n` + "They have access to: ```" + channellistformatted + "```");
    console.log(usertomute);

}

module.exports.help = {
    name: "hardmute"
}