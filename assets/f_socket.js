let Users,Maison,Admin,Contact, io;
module.exports = (_Users , _Maison , _Admin,_Contact, _io) => {
    Maison = _Maison;
    Users = _Users;
    Admin = _Admin;
    io = _io;
    Contact = _Contact;
    return define(io)
};

function define(io) {
    io.sockets.on('connection', (socket) => {
        socket.on('getimglist', async (id) =>{
            let list = await Maison.getPlan(id)
            socket.emit('getimglist', list)
        })

        socket.on('contact', async (variables) => {
            let c = await Contact.add(variables.user_id, variables.maison_id)
            socket.emit('contact')
        })
    })
    return io;
}