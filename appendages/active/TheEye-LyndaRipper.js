const Discord = require('discord.js');
const fs = require("fs");
const path = require('path');

module.exports.run = async (client, message, args) => {

    //require
    let util = require("util"),
        exec = require("child_process").exec,
        child;

    //lyndaurl
    let lyndaurl = args[0];
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[lynda]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    let verify = regex.test(lyndaurl);
    let requestID = message.id;

    console.log(requestID);


    //
    if (verify === true) {

        function youtubeRip(lyndaurl, requestID){
            console.log("Recieved request from (" + message.author.id + ") to rip lynda course: " + lyndaurl);
            message.reply(`Received request to download that course. I will PM you with details once I have finished assembling it.`);

            var youtubedl = require('youtube-dl');
            var url = lyndaurl;
            let options = ['--cookies=./.config/cookie_files/lynda.txt', '--write-sub', '--embed-subs', '--write-thumbnail', '--embed-thumbnail', '-o', `Resources/Video/${requestID}/%(playlist)s/%(chapter_number)s _ %(chapter)s/[%(playlist_index)s] %(title)s.%(ext)s`];

            youtubedl.exec(url, options, {}, function (err, output) {
                if (err) {
                    console.log(err);
                    //remove bad request
                    const rimraf = require("rimraf");
                    rimraf(`Resources/Video/${requestID}/`, function () { console.log("Wiped bad request folder"); });

                    var logger = fs.createWriteStream(`Resources/Logs/${requestID}.log`, { flags: 'a' });
                    let errorcode = output.join('\n');
                    logger.write(`${message}\n\n\n----------------------BEGIN ERROR----------------------\n${errorcode}----------------------END ERROR----------------------\n`)
                    logger.end();
                    message.author.send("Hi, something has gone wrong with your request. Please ping or DM <@167511389487759360> and include the following code in your mention.")
                    message.author.send("```" + `${requestID}` + "```");
                }

                console.log(output);

            });
        };


        function rcloneServe() {
            //get a random username.
            let serveUser = Math.random().toString(36).substr(2, 10);
            //get a random password.
            let servePass = Math.random().toString(36).substr(2, 10);

            //get random port to serve on.
            let servePort = Math.floor(Math.random() * (33100 - 33000 + 1)) + 33000;

            child = exec(`rclone serve http --user ${serveUser} --pass ${servePass} --addr=127.0.0.1:${servePort} ./Resources/Video/${requestID}/`, function (error, stdout, stderr) { });

            message.author.send(`Hi, your Lynda request is being conjured!\nYou will have **__One hour__** to grab everything before the instance is closed and the files are deleted from the server.\nBelow are your login details: ` +
                "```" +
                '\n' +
                `URL: localhost:${servePort}\nUsername: "${serveUser}"\nPassword: "${servePass}"` +
                "```" +
                `\nIf you would like to just wget this directory then throw in the following command: ` +
                "`" + `wget -r -np -R "*.html" "${serveUser}:${servePass}@localhost:${servePort}"` + "`\n Cheers, and thanks for being a supporter!");
        };

        function removeSession(requestID) {
            const rimraf = require('rimraf');
            rimraf(`Resources/Video/${requestID}`, function(e){
                console.log(e);
                console.log('okay');
            });
        };


        //Main function
        function lyndaRip(){
            youtubeRip();
            setTimeout(rcloneServe, 3600000);
            removeSession();
        };

        lyndaRip();
    }

}

module.exports.help = {
    name: "LyndaRip"
}