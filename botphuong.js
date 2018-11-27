let request = require('request');
let _ = require('lodash');
let FACEBOOK_URL_ENPOINT = 'https://graph.facebook.com/v3.1';
let MAX_TIMEOUT = 10000; // Max request timeout in milliseconds
//const colors = require('colors');
///////// YOU CAN EDIT HERE /////////////////
let my_id = '100007517616432'; // Put your facebook ID here, ex: 100239482
let token = 'EAAAAAYsX7TsBAJxS5gTsNEAACIZAApdlZBZC2U3jNaX1jAYBZAjuUwGHsDQAQ8US7yaqrrhXTDSnuZCHPqXZCddZAnJlJjl4HF4897WZB7Alfb8zh5aThJKKaD5cbLZCsxOssuPFkHCVHQtvasW97SXMWSfMelNoFdCOw9WsiIKFyrWmgVK4pUnZCRH1ZBfg4WtJM85WUXLJBaJegQ0yHUp4ZAz4'; // Your access token here: EAAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
let ids = ['100008229345236','100008511364003']; // Put the ids of who you wanna react to, ex: ['105601560', '10081564']
let react = ['LOVE']; // List of reactions. Valid reaction list:  LIKE, LOVE, WOW, HAHA, SAD, ANGRY, THANKFUL

///////// YOU MIGHT MODIFY THIS //////////////
let REQUEST_TIME = 60; // Running task each XXX seconds. Do not put small number or your accout might be locked.

///////// DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU GONNA DO /////////
setInterval(requestFeed, REQUEST_TIME * 1000);

function requestFeed() {
  ids.map(async (id) => {
    //console.log('[' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '] Reaction to ' + owner + ' ...');
    let opt = {
      url: `${FACEBOOK_URL_ENPOINT }/${id}/feed?fields=id,reactions.limit(500){id},from&limit=10&access_token=${token}`,
      timeout: MAX_TIMEOUT,
      method: "GET",
      pool: {
        maxSockets: 100
      }
    };
    request(opt, function (err, res, body) {
      if (err){
        console.log('Error: ' + err);
        return;
      }
      try {
        const data = JSON.parse(body);
        if (!_.isUndefined(data.error)){
          console.log(`Error returned 1: ${data.error.message}`);
          return;
        }
        const posts = data.data;
        posts.map((post) => {
          let post_id = post.id;
          let post_by = post.from;
          let is_reacted = false;
          let post_by_owner = true;
          if (!_.isUndefined(post.reactions)) {
            let reaction_ids = post.reactions.data;
            reaction_ids.map((react_id)=>{
              if (String(react_id.id) === String(my_id)) {
                is_reacted = true;
              }
            })
          }
          if (String(post_by.id) !== String(id)) {
            post_by_owner = false;
          }
          if (!is_reacted && post_by_owner) {
            // console.log('[' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '] Reacting to ' + post_id + ' ...');
            let selected_action = react[Math.floor(Math.random() * react.length)]; // Random reaction
            doReact(post_id, selected_action);
          } else {
            //console.log('[' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '] Already reacted to '+ post_id+' ...');
          }
        });
        return;
      } catch (err) {
        console.log(JSON.stringify(body));
        console.log(err);
        return;
      }
    })
  })
}

function doReact(post_id, react) {
  let opt = {
    url: `${FACEBOOK_URL_ENPOINT}/${post_id}/reactions?type=${react}&access_token=${token}`,
    timeout: MAX_TIMEOUT,
    method: 'POST',
    pool: {
      maxSockets: 100
    }
  };
  return request(opt, function (err, res, body) {
    if (err) {
      console.log(err);
    }
    return;
  });
}

function module5() {
  console.log('phuong started doing its job!');

 // setInterval(function () {
  //  console.log(('botkate timer:' + new Date().getTime()).red);
 // }, 99999);
}

module.exports = module5;