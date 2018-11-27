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
        message.channel.send('lyrics not found');
      }
      else {
        request(metroUrl, function (error, response, html) {
          if (!error) {
            var $ = cheerio.load(html);
            var data = $('.verse');
            message.channel.send({
              embed: {
                color: 3447003,
                title: 'Lyrics for your requested song',
                description: data.text()
              }
            });
          }
          else {
            message.channel.send('lyrics not found')
          }
        });
      }
    }
    else {
      message.channel.send('lyrics not found');
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
