//Uses googles perspective api to measure toxicity of non command messages.
const Discord = require('discord.js');
const request = require("request");

module.exports.run = async (client, message, args) => {
//Code here

const Perspective = require('perspective-api-client');
const perspective = new Perspective({ apiKey: '' });

let perspectivecontent = message.content;

const text = "'" + perspectivecontent + "'";
const result = await perspective.analyze({
    comment: { text }
});
let returnedString = JSON.stringify(result, null, 2);
let parsedString = JSON.parse(returnedString);
console.log("Message: " + perspectivecontent + `\n` +
"SCORE: " + parsedString.attributeScores.TOXICITY.summaryScore.value);

}

module.exports.help = {
    name: "toxicity"
}