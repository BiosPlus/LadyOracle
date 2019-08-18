const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {



    const {ServerIP} = require('../../config/Discord/config.actual.json');
   
    //basic global variables
    let lyndaurl = args[0];
    let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)lynda.(com)\/[\w.-]+\/[\w.-]+\/\d{5,8}\-\d\.html$/gm;
    let verify = regex.test(lyndaurl);
    let requestID = message.id;

    function Downloader() {
        return new Promise((resolve, reject) => {

            message.reply(`Received request to download that course. I will PM you with details once I have finished assembling it.`);

            var youtubedl = require('youtube-dl');
            var url = lyndaurl;
            let options = ['--cookies=./config/cookie_files/lynda.txt', '--write-sub', '--embed-subs', '--write-thumbnail', '--embed-thumbnail', '-o', `Resources/Video/${requestID}/%(playlist)s/%(chapter_number)s _ %(chapter)s/[%(playlist_index)s] %(title)s.%(ext)s`];

            //console.log(options);

            youtubedl.exec(url, options, {}, function (err, output) {
                if (err) {
                    //console.log(err);
                    //remove bad request
                    const rimraf = require("rimraf");
                    rimraf(`Resources/Video/${requestID}/`, function () { console.log("Wiped bad request folder"); });

                    let fs = require("fs");
                    var logger = fs.createWriteStream(`Resources/Logs/${requestID}.log`, { flags: 'a' });
                    let errorcode = output.join('\n');
                    logger.write(`${message}\n\n\n----------------------BEGIN ERROR----------------------\n${errorcode}\n\n${err}\n----------------------END ERROR----------------------\n`)
                    logger.end();
                    message.author.send("Hi, something has gone wrong with your request. Please ping or DM Bios and include the following code in your mention.")
                    message.author.send("```" + `${requestID}` + "```");
                    reject();
                };
                //console.log("Playlist download completed")
                resolve();
            });
        });
    };

    function RcloneHost() {
        return new Promise((resolve, reject) => {

            //get a random username.
            let serveUser = Math.random().toString(36).substr(2, 10);
            //get a random password.
            let servePass = Math.random().toString(36).substr(2, 10);

            //get random port to serve on.
            let servePort = Math.floor(Math.random() * (33100 - 33000 + 1)) + 33000;

            const child_process = require("child_process");
            var fuckingmurder = require('tree-kill');

            message.author.send(`Hi, your Lynda request is being conjured!\nYou will have **__One hour__** to grab everything before the instance is closed and the files are deleted from the server.\nBelow are your login details (please do not share these with anyone other than yourself): ` +
                "```" +
                '\n' +
                `URL: ${ServerIP}:${servePort}\nUsername: "${serveUser}"\nPassword: "${servePass}"` +
                "```" +
                `\nIf you would like to just wget this directory then throw in the following command: ` +
                "`" + `wget -r -np -R "*.html" "${serveUser}:${servePass}@${ServerIP}:${servePort}"` + "`\n Cheers, and thanks for being a supporter!");

            //console.log("starting rclone");

            serve = child_process.exec(`rclone serve http --user ${serveUser} --pass ${servePass} --addr ${ServerIP}:${servePort} ./Resources/Video/${requestID}/`, {});

            //console.log("ProcessID: " + serve.pid)
            setTimeout(function () {
                fuckingmurder(serve.pid);
                console.log(`Rclone on port ${servePort} has been fucking iced.`);
                resolve();
            }, 3600000);
        })
    };

    function Remover() {
        return new Promise((resolve, reject) => {
            const rimraf = require("rimraf");
            rimraf(`Resources/Video/${requestID}/`, function (e) {
                console.log("We removed the session known as: " + requestID);
                message.author.send(`Just a heads up, that the session + files have now been killed. There are no limits to requests so feel free to throw another`);
            });
            resolve();
        })
    };


    if (verify === true && message.channel.id === "610399116308250654" || message.channel.id === "610399250710528020"){
        console.log("LyndaURL came back as positive");
        Downloader().then(RcloneHost).then(Remover);
    }

    else {
        message.reply(`That URL doesn't look right, are we sure it's hosted on Lynda and is actually a course? Have you accidentally put the url as "<URL>"?\nHere's an example of what we want: <https://www.lynda.com/Node-js-tutorials/Learning-Node-js/612195-2.html> (Note the URL format is /Course-Type/Course-Name/Course-Code-2/)\nIf there are persistant issues, ping Bios.`);
    }
    return
}

module.exports.help = {
    name: "Lynda"
}