const ytdl = require('ytdl-core');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./settings/credentials.json');
client.login(client.config.token1);

client.on('message', message => {
    if (message.content === './leave') {
        client.leaveVoiceChannel;
    };
    if (message.content === './autoplaylist') {
        var voiceChannel = client.channels.get('494899758838841356');
        if (!message.guild.me.voiceChannel) {
            voiceChannel.join().then(connection => {
                playMusic(connection);

            }).catch(err => console.log(err));
        }
    };
    if (message.content === './quit') {
        client.destroy().then(() => client.login(client.config.token1));
    }; //quit
    const streamOptions = { seek: 0, volume: 1 };

    //  function getMusic() {
    //
    //      let lines = fs.readFileSync('./data/autoplaylist.txt').toString().split("\n");
    //    return lines[Math.floor(Math.random() * lines.length)];
    //}
    /*async function findinfo(){
      var infomation = await ytdl.getInfo(getMusic())
      console.log(infomation)
    }*/

    function playMusic(connection) {
        let lines = fs.readFileSync('./data/autoplaylist.txt').toString().split("\n");
        const randomm = lines[Math.floor(Math.random() * lines.length)];

        // random line
        ytdl.getInfo(randomm, (err, info) => {
            const channel = client.channels.get('494899781785616385');
            if(message.channel !== channel) return;
            if (err) throw (err);
            if (info) {
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: info.title,
                        author: info.author,
                        thumbnail: {
                            url: info.thumbnail_url
                        },
                        footer: {
                            text: `• Thời lượng: ${info.length_seconds}`
                        }

                    }

                }); // end of embed
                
                channel.setTopic(`Playing ${info.title}`)
            }
        });
        var stream = ytdl(randomm, { filter: 'audioonly' });
        var dispatcher = connection.playStream(stream, streamOptions);
        dispatcher.on("end", end => {
            playMusic(connection);
            //  findinfo();
        });

    }


});
function lol() {
  console.log('botkate started doing its job!');

 // setInterval(function () {
   // console.log(('botkate timer:' + new Date().getTime()).red);
 // }, 99999);
}

module.exports = lol;