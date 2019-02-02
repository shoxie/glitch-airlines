var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');


exports.exec = (Bastion, message, args) => {
  var query = args;
  var searchUrl = "https://www.google.co.in/search?q=" + query + "+metrolyrics";
  var metroUrl;
  request(searchUrl, function (error, response, html) {
    //  console.log(response);
    if (!error) {
      console.log(searchUrl);
      var $ = cheerio.load(html);

      var links = $('a', '.r');

      $(links).each(function (i, link) {
        var text = $(links).text();
        if (text.search("MetroLyrics") !== -1) {
          metroUrl = $(link).attr('href').substring(7);
          console.log(metroUrl);
          return false;
        }
      });
      if (!metroUrl || metroUrl.length < 3) {
        message.channel.send({
          embed: {
            color: 0xff0000,
            description: 'Lyrics not found'
          }
        });
      }
      else {
        request(metroUrl, function (error, response, html) {

          if (!error) {
            var $ = cheerio.load(html);
            var data = $('.verse');
            var output = data.contents().text();
            var myfields = [];
            var array = output.split('\n');
            var tmp = 0;
            var sttmp = '';
            for (var i = 0; i <= array.length; i++) {
              sttmp += array[i] + ' \n ';
              tmp++;
              if (tmp == 18) {
                myfields.push({ name: '------------------------------------------------', value: sttmp });
                tmp = 0;
                sttmp = '';
              }
            }

            message.channel.send({
              embed: {
                color: 3447003,
                title: "LYRICS FOUND",
                fields: myfields,
                footer: {
                  "icon_url": message.author.avatarURL,
                  text: "Requested by " + message.author.username + " || Powered by MetroLyrics"
                }
              }
            });
          }
          else {
            message.channel.send({
              embed: {
                color: 0xff0000,
                description: 'Lyrics not found'
              }
            });
          }
        });

      }
    }
    else {
      message.channel.send({
        embed: {
          color: 0xff0000,
          description: 'Lyrics not found'
        }
      });
    }
  });

}

exports.help = {
  name: 'lyrics',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'show lyrics',
  example: []
};
exports.config = {
  aliases: [],
  enabled: true
};
