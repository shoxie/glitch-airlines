const cheerio = require('cheerio');
const request = require('request');

exports.exec = async(Bastion, message, args) => {
    var str = JSON.stringify(args);
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");


    var apiConfig = {
        apiURL: 'http://nhaccuatui.com/tim-kiem/bai-hat?q=' + str,
        endpointURL: 'https://query.yahooapis.com/v1/public/yql?q='
    }

    request(apiConfig.apiURL, function (error, response, body) {
        var $ = cheerio.load(body);
        var requiredLink = $('.title_song').first().children('a').first().attr('href');

        if (requiredLink) {
            request(requiredLink, function (error, response, body) {
                if (error) throw error;
                if (!error) {
                    var $ = cheerio.load(body)
                    var data = $('p#divLyric');
                    var lyrics = data.eq(0).text();
                    var output = lyrics.split("\n");

                    // var arrayOfLines = lyrics.match(/[^\r\n]+/g);
                    var myfields = [];
                    var tmp = 0;
                    var sttmp = '';
                    for (var i = 0; i <= output.length; i++) {
                        sttmp += output[i] + ' \n ';
                        tmp++;
                        if (tmp == 15) {
                            myfields.push({ name: '------------------------------------------------', value: sttmp });
                            tmp = 0;
                            sttmp = '';
                        }
                    }
                    var link = requiredLink

                    message.channel.send({
                        embed: {
                            color: 3447003,
                            title: output[1],
                            url: link,
                            fields: myfields,
                            footer: {
                                "icon_url": message.author.avatarURL,
                                text: "Requested by " + message.author.username + " || Powered by Nhaccuatui.com"
                            }
                        }
                    });


                }
            });
        }

    });


};


exports.help = {
    name: 'lyricsvietnam',
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
