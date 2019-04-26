var socket =io.connect('http://localhost:8080');
function contact(user_id, maison_id){
    socket.emit('contact', {user_id, maison_id})
    console.log("send")
}

socket.on('contact',() => {
    alert('Votre message a bien été envoyé')
    $('#btn_contact').remove()
})