exports.exec = (Kara, message, args) => {
    if (message.author !== '155622262660268033') return;
    let guild = message.guild;
    let nick = guild.members;
    nick.forEach((user, key) => {
        if (!user.has.roles(args[0])) user.addRole(args[0])
    });
}
exports.config = {
    aliases: ['rolechange'],
    enabled: true
};
exports.help = {
    name: "bulkRoleAdd",
    description: "Change role of everyone in the server"
}