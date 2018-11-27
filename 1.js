const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');

//const TOKEN = 'NDMwMzcxMjY0NzUwOTQ0Mjgz.DiZU3w.IbRLUpUVbQXU9-cylCk5Aas2muc'
//const colors = require('colors');


bot.login('Mzk3MzQ2NTY4MDg2MjI0OTA2.Dp-6CA.Kj7MWMM_JtzqiX53k2R-V8RAdls')

/*
bot.on("message", message => {
  var sender = message.author;
  var msg = message.content.toUpperCase();
  if(message.channel.id != ('412215261647601665') && msg.startsWith('.PLAY'))
  message.delete();
  else
  return;

}); *//*
bot.on('message', message => {
  //bot listen
  if (message.channel.id != ('412215261647601665')) return;
  if (message.guild.id != ('335604901730058243')) return;
  //setup message bot
  let sender = message.author;
  let msg = message.content.toUpperCase(); //nhan message
   // bot khong read message
   if(sender.id === '430371264750944283') {
     return; //dung function
   }
    if(msg.startsWith('.')) {
      return;
    }
    else
      message.delete(); 
});
bot.on('message', message => {
  if (message.channel.id != ('436171633737072640')) return;
  var sender = message.author;
  var msg = message.content.toUpperCase(); //nhan message
   // bot khong read message
   if(sender.id === '430371264750944283') {
     return; //dung function
   }
    if(message.content === 'join'){
  console.log('in')
    message.member.setVoiceChannel('435656516746608662');
    message.member.addRole('469543140798365697');
    }
  if(message.content === 'leave'){
    
    console.log('out')
    message.member.setVoiceChannel('399111805667901462');
   message.member.removeRole('469543140798365697');
  }
  if(message.content != 'join') message.delete();
  if(message.content != 'leave') message.delete();
});
*/

bot.on('presenceUpdate', async (oldMember, newMember) =>{
var myInterval=[];
  const guild = newMember.guild;
  if((newMember.presence.game != null) &&(!newMember.user.bot)) {
    
   /* await guild.createChannel({
      guild: '335604901730058243',
      name: newMember.presence.game.name,
      type: 'voice'
    }).catch();*/
    
    // neu chua co channel thi tao channel
    var gamechannel =await bot.channels.find('name',newMember.presence.game.name);
    if (!gamechannel){
    await guild.createChannel(newMember.presence.game.name, 'voice');
    }
    
    
    // vao channel
    gamechannel =await bot.channels.find('name',newMember.presence.game.name);
      if(gamechannel){
    newMember.setVoiceChannel(gamechannel);
      }
  }
  
  
  if(newMember.presence.game === null) {
    newMember.setVoiceChannel('494366315969118209');
  }
  
  
  const channelNames=oldMember.presence.game.name;
  const oldchannel =await bot.channels.find('name', channelNames);
  if (!myInterval[channelNames]){
    myInterval[channelNames]=setInterval(function(){
       var newshit = oldchannel.members.filter(member => !member.user.bot).size;
        if (newshit === 0) {
      console.log(`DELETED: ${channelNames}`);
          oldchannel.delete();
            clearInterval(myInterval[channelNames]); 
            myInterval[channelNames] = null;
        }
    },5000);
  }
});
  
 /* const oldshit = client.roles.find(newMember.presence.game.name, 'name');
  if(!oldshit) {
    await guild.deleteChannel(oldMember.presence.gamename, 'name')
  }*/




/* message delete for main bot
bot.on('message', async message => {
  let musicText = await message.client.db.get(`SELECT musicTextChannel FROM guildSettings WHERE guildID=${message.guild.id}`);
  let prefixText = await message.client.db.get(`SELECT prefix FROM guildSettings WHERE guildID=${message.guild.id}`);
  //console.log(guildSettings.musicTextChannel);
        let msg = message.content.toUpperCase();
        if(message.channel.id === musicText.musicTextChannel) {
          let sender = message.author;
          if(sender.id === '430371264750944283') return;
            if (msg.startsWith(`${prefixText.prefix}`)) {
                return;
            } else {
                message.delete();
            }
        }
});
*/
bot.on("ready",async () => {
  const channel = bot.channels.get("494899758838841356");
  if (!channel) return console.error("The channel does not exist!");
  await getMusic();
  channel.join().then(connection => {
    
    playMusic();
    // Yay, it worked!
    console.log("Successfully connected.");
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
  const streamOptions = { seek: 0, volume: 1 };
function getMusic(){
 let lines = fs.readFileSync('./data/autoplaylist.txt').toString().split("\n");
    return lines[Math.floor(Math.random()*lines.length)];
    
 }

function playMusic(connection){
     console.log("dit me may luon");
            var stream = ytdl(getMusic(), { filter : 'audioonly' });
            var dispatcher = connection.playStream(stream, streamOptions);
            dispatcher.on("end", end => {
                console.log("left channel");
                playMusic(connection);
            });
            
}
var voiceChannel = await bot.channels.get('494899758838841356');
        voiceChannel.join().then(connection => {
            playMusic(connection);
      
        }).catch(err => console.log(err));
});



function module3() {
  console.log('bot started doing its job!');

  //setInterval(function () {
    //console.log(('bot timer:' + new Date().getTime()).red);
 // }, 99999);
}

module.exports = module3;