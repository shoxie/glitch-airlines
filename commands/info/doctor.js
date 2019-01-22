const fs = require("fs");
const Discord = require("discord.js");

exports.exec = (Bastion, message, args) => {
  const fs = require("fs");


  exports.run = (Bastion, message, args) => {
    if (!isNaN(args[0])) {
      let path = './data/doctors/' + args[0] + '.json';
      fs.readFile(path, (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);
        // console.log(student);
        message.channel.send({
          embed: {
            title: student.title,
            description: student.description,
            color: 3495809,
            thumbnail: {
              url: student.thumbnail,
            },
            footer: {
              text: "TARDIS Files",
            }
          }
        });
      });


    }
    else message.channel.send({
      embed: {
        title: 'Invalid',
        color: 0xff0000,
        description: 'Oops, that Doctor is either finding for Amy or flying somewhere with his Tardis'
      }
    });
  }

}





exports.config = {
  aliases: ['doctor'],
  enabled: true
};

exports.help = {
  name: 'doctor',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'doctor [number]',
  example: ['doctor 13']
};
