const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    //Ensure the resource folder exists.
        var fs = require("fs");
        var dir = "./Resources/Audio";

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

  //Parse URL check if it's an FTP/HTTP link that ends with mp3, flac, or god-tier opus
  let linkedaudio = args[0];

  console.log(linkedaudio);
  //Backup regex var,
  //var regex = /^(https?|ftp)+[\w\d:#@%/;$()~_?\+-=\\\.&]*[A-Za-z0-9]\.(mp3|opus|flac)$/gm;



  let regex = /^(https?|ftp)+[\w\d:#@%/;$()~_?\+-=\\\.&]*[A-Za-z0-9]$/gm;
  let verify = regex.test(linkedaudio);
  console.log("Recieved request from (" + message.author.id + ") to download file from: " + linkedaudio);
  let UniqueRequestID = message.author.id;


  if (verify === true) {
    //Var the origin url
    let util = require("util"),
      exec = require("child_process").exec,
      child,
      url = linkedaudio;

      
    //Exec to curl origin url
    child = exec('curl -LIs -o /dev/null -w %{url_effective} "' + url + '"', function(error,stdout,stderr) {      
      let mesverified = stdout;
      console.log("Origin url is: " + mesverified);

      //Regex origin url, make sure it's an accepted right format
      let originregex = /^(https?|ftp)+[\w\d:#@%/;$()~_?\+-=\\\.&]*[A-Za-z0-9]\.(mp3|opus|flac)$/gm;
      let originverify = originregex.test(mesverified);

      //Check that the file is under 100MB before DL
      //Var the origin url
      let util = require("util"),
        exec = require("child_process").exec,
        child,
        url = mesverified;


      child = exec(
        "curl -LIs " + '"' + mesverified + '" | grep Content-Length | sed "s/[^0-9]//g"',
        function(error, stdout, stderr) {
          let verifysize = stdout;
          //console.log('detected size: ' + verifysize);

          if (originverify === true && verifysize <= 100000000) {
            //Affirm received message.
            message.channel.startTyping();

            message.reply(UniqueRequestID)
            //GRAB THE URL WITH WGET
            const wget = require("wget-improved");
            let tempTrack = `./Resources/Audio/${UniqueRequestID}.mp3`;
            //let output = "./Resources/Audio/track.mp3";
            let output = tempTrack;
            let options = {};

            let download = wget.download(mesverified, output, options);

            download.on("error", function(err) {
              console.log("error code: " + err);
              message.channel.stopTyping();
              message.channel.send("Unable to download file, site returned a 404. Please wait a second while I reset.");
            });

            download.on("start", function(fileSize) {
              const formatAsSizeComp = `${Math.round(fileSize / 1000)}`;
              console.log("Filesize is: " + formatAsSizeComp + "KB");

              //REPLY WITH CONFIRMATION
              message.reply("Thanks for making a request. The filesize is " + formatAsSizeComp + "KB. Please wait in the channel while I fetch that.");

              download.on("progress", function(progress) {
                const formatAsPercentage = x => `${Math.round(x * 100)}%`;
                const formatAsSizeProg = x =>
                  `${Math.round((x * fileSize) / 1000)}`;

                //PROGRESS BAR WRITE and REFRESH
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write("Downloading file: " + formatAsSizeProg(progress) + "KB / " + formatAsSizeComp + "KB | " + "Total: " + formatAsPercentage(progress));
              });
            });

            download.on("end", function(output) {
              message.channel.stopTyping();
              console.log("\n" + output + ", file is ready to play");

              //JOIN THE VOICE CHANNEL
              let voiceChannel = message.member.voiceChannel;
              voiceChannel
                .join()
                .then(connection => {
                  let dispatcher = connection.playFile(tempTrack);
                  message.react("➡");
                  dispatcher.on("end", end => {
                    voiceChannel.leave();

                    //DELETE THE FILE
                    fs.unlink(tempTrack);

                    //Reactions
                    message.react("✅");
                  });
                })
                .catch(err => console.log(err));
            });
          }

          if (originverify === false) {
            message.channel.stopTyping();
            message.channel.send(
              "The original file behind the redirects is not an accepted format."
            );
          } 
        }
      );
    });
  }
  
  
  else {
    message.reply("That's not a good url. We need to match this criteria");

    const errorEmbed = new Discord.RichEmbed()
      .setColor("#0099ff")
      .setTitle("AudioPlay")
      .setDescription("Using AudioPlay")
      .addField(
        "!!AudioPlay URL",
        "The URL must be direct to either a http/s or FTP site, no url shorteners.",
        true
      )
      .addField("Accepted file formats", "MP3, FLAC, OPUS", true)
      .addField(
        "Example command",
        "!!AudioPlay https://www.podtrac.com/pts/redirect.mp3/audio.wnyc.org/anthropocene-reviewed/anthropocene-reviewed111518.mp3",
        true
      )
      .addField(
        "YOU MUST BE IN A VOICE CHANNEL",
        "Join a channel before submitting a request.",
        true
      );

    message.channel.send(errorEmbed);
  }


};

module.exports.help = {
  name: "AudioPlay"
};
