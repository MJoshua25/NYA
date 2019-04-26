let Users,Maison,Admin,Contact, io;
module.exports = (_Users , _Maison , _Admin,_Contact, _io) => {
    Maison = _Maison;
    Users = _Users;
    Admin = _Admin;
    io = _io;
    Contact = _Contact;
    return router
};

var express = require('express');
var router = express.Router();

router.route('/:id')
    .get(async (req, res) => {
        let maison = await Maison.getMaison(req.params.id)
        maison.img = await Maison.getImg(maison.id)
        maison.plan = await Maison.getPlan(maison.id)
        maison.buy = false
        maison.contacted = false
        if(req.session.user!=undefined){
            maison.buy = await Maison.verifAchat(req.session.user.id, maison.id)
            maison.contacted = await Contact.isContacted(req.session.user.id, maison.id)
        }
        else 
            if (req.session.admin!=undefined){
                maison.buy = true
                maison.contacted = true
            }
                
        res.render('maison/index', {maison: maison, user:req.session.user, admin:req.session.admin})
    });

router.route('/:id/buy')
    .get(async (req, res) =>{
        let achat = await Maison.addAchat(req.session.user.id, req.params.id)
        res.redirect('../../maison/' + req.params.id)
    })