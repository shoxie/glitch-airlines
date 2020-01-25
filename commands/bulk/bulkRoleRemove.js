exports.exec = (Kara, message, args) => {
    if (message.author !== '155622262660268033') return;
    let guild = message.guild;
    let nick = guild.members;
    nick.forEach((user, key) => {
        if (user.has.roles(args[0])) user.removeRole(args[0])
    });
}
exports.config = {
    aliases: ['roleremove'],
    enabled: true
};
exports.help = {
    name: "bulkRoleRemove",
    description: "Change role of everyone in the server"
}