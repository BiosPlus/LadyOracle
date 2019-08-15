const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    //basic global variables
    let lyndaurl = args[0];
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[lynda]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    let verify = regex.test(lyndaurl);
    let requestID = message.id;
    //let cookies_file = require('');

    function Downloader() {
        return new Promise((resolve, reject) => {

            message.reply(`Received request to download that course. I will PM you with details once I have finished assembling it.`);

            var youtubedl = require('youtube-dl');
            var url = lyndaurl;
            let options = ['--cookies=./config/cookie_files/lynda.txt', '--write-sub', '--embed-subs', '--write-thumbnail', '--embed-thumbnail', '-o', `Resources/Video/${requestID}/%(playlist)s/%(chapter_number)s _ %(chapter)s/[%(playlist_index)s] %(title)s.%(ext)s`];

            console.log(options);

            youtubedl.exec(url, options, {}, function (err, output) {
                if (err) {
                    console.log(err);
                    //remove bad request
                    const rimraf = require("rimraf");
                    rimraf(`Resources/Video/${requestID}/`, function () { console.log("Wiped bad request folder"); });

                    let fs = require("fs");
                    var logger = fs.createWriteStream(`Resources/Logs/${requestID}.log`, { flags: 'a' });
                    let errorcode = output.join('\n');
                    logger.write(`${message}\n\n\n----------------------BEGIN ERROR----------------------\n${errorcode}----------------------END ERROR----------------------\n`)
                    logger.end();
                    message.author.send("Hi, something has gone wrong with your request. Please ping or DM <@167511389487759360> and include the following code in your mention.")
                    message.author.send("```" + `${requestID}` + "```");
                };
                console.log("Playlist download completed")
                resolve();
            });
        });
    };

    function RcloneHost() {
        return new Promise((resolve, reject) => {
            message.reply(`RCLONE HOST IS NOW RUNNING ON PORT FUCK YOU. GIVE ME 5 SECONDS AND WE'RE GOING TO TEAR YOU A NEW ASSHOLE FUCKER.`);
            resolve();
        })
    };

    function Remover() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                message.reply(`NOW REMOVING ALL THE FILES`);
            }, 5000);
            resolve();
        })
    };

    Downloader().then(RcloneHost).then(Remover);
    return
}

module.exports.help = {
    name: "Lynda"
}