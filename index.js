// Import the discord.js module
const Discord = require('discord.js');
const fs = require("fs");
const {
    prefix,
    token,
    ServerIP
} = require('./config/Discord/config.actual.json');

//Start the Client
const client = new Discord.Client();

//Active Appendage Collection
client.appendagesactive = new Discord.Collection();
fs.readdir("./appendages/active/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could not find any active type appendages. Check dir tree and ensure there are files under the appendages/active folder");
        return;
    }

    jsfile.forEach((f, i) => {
        let limbs = require(`./appendages/active/${f}`);
        console.log(`[Active] ${f} found.`);
        client.appendagesactive.set(limbs.help.name, limbs);
    });
});


//Passive Appendage Collection
client.appendagespassive = new Discord.Collection();
fs.readdir("./appendages/passive/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Could not find any passive type appendages. Check dir tree and ensure there are files under the appendages/passive folder");
        return;
    }

    jsfile.forEach((f, i) => {
        let limbs = require(`./appendages/passive/${f}`);
        console.log(`[Passive] ${f} found.`);
        client.appendagespassive.set(limbs.help.name, limbs);
    });
});


//lifecheck
client.on('ready', async () => {
    client.user.setActivity("Prefix: " + prefix, {
        type: "PLAYING"
    });
    console.log(client.user.username + ` is live on ${ServerIP}`);
});
//bot token
client.login(token);





//APPENDAGE TESTING GROUND

//var isReady = true;




client.on('message', async message => {

    //comm = command itself from the first place on the array
    //if (message.channel.type === "dm") return;

    let messageGrabArray = message.content.split(" ");
    let comm = messageGrabArray[0];
    let args = messageGrabArray.slice(1);

    let appendagerouteActive = client.appendagesactive.get(comm.slice(prefix.length));


    if (comm.startsWith(prefix)) {

        //console.log(`[ID:${message.id}] Route: ${appendagerouteActive}`);
        if (appendagerouteActive) appendagerouteActive.run(client, message, args);

        //TESTBED

        if (comm === `${prefix}tester`) {
            message.reply("SUCCESS!")
        }
    }

    //Passive scanning of text channels, anything sent here will trigger everything in the passive folder
    if (message.channel.type = "text") {
        //console.log("THIS SHOULDNT SHOW")
    }
});