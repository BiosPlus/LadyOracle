// Import the discord.js module
const Discord = require('discord.js');
const fs = require("fs");
const {
    prefix,
    token
} = require('./config.actual.json');

//Start the Client
const client = new Discord.Client();

//Active Appendage Collection
client.appendages = new Discord.Collection();
fs.readdir("./appendages/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could not find any active type appendages. Check dir tree and ensure there are files under Appendages folder");
        return;
    }

    jsfile.forEach((f, i) => {
        let limbs = require(`./appendages/${f}`);
        console.log(`${f} found.`);
        client.appendages.set(limbs.help.name, limbs);
    });
});


//Passive Appendage Collection
client.appendages = new Discord.Collection();
fs.readdir("./appendages/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could not find any active type appendages. Check dir tree and ensure there are files under Appendages folder");
        return;
    }

    jsfile.forEach((f, i) => {
        let limbs = require(`./appendages/${f}`);
        console.log(`${f} found.`);
        client.appendages.set(limbs.help.name, limbs);
    });
});


//lifecheck
client.on('ready', async () => {
    client.user.setActivity("Prefix: " + prefix, {
        type: "PLAYING"
    });
    console.log(client.user.username + " is live.");
});
//bot token
client.login(token);

//APPENDAGE TESTING GROUND

//var isReady = true;




client.on('message', async message => {

    //comm = command itself from the first place on the array
    if (message.channel.type === "dm") return;

    let messageGrabArray = message.content.split(" ");
    let comm = messageGrabArray[0];
    let args = messageGrabArray.slice(1);

    let appendageroute = client.appendages.get(comm.slice(prefix.length));

    console.log("route: " + appendageroute);
    if (appendageroute) appendageroute.run(client, message, args);

    //TESTBED

    //if (comm === `${prefix}tester`) {
    //    let usertomute = message.guild.member(message.mentions.users.first());
    //   console.log(usertomute);
    //}    


    //Passive scanning of text channels, anything sent here will trigger everything in the passive folder
    if (message.channel.type = "text") {
        
    }
});