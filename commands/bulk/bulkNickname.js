exports.exec = (Kara, message, args) => {
    if (message.author !== '155622262660268033') return;
    let guild = message.guild;
    let nick = guild.members;
    nick.forEach((user, key) => {
        user.setNickname(args[0], args[1])
    });
}
exports.help = {
    name: "bulkNickname",
    description: "Change nickname of everyone in the server",
    usage: "bulkRoleAdd nickname reason"
}