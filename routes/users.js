let Users,Maison,Admin, io;
module.exports = (_Users , _Maison , _Admin, _io) => {
    Maison = _Maison;
    Users = _Users;
    Admin = _Admin;
    io = _io;
    return router
};

var express = require('express');
var router = express.Router();

router.route('/')
    .get(async (req, res) => {
        if(req.session.user != undefined){
            let achats = await Maison.getMaisonByUser(req.session.user.id)
            achats.forEach(async (maison) => {
                maison.plan = await Maison.getPlan(maison.id)
            })
            res.render('user/index.twig', {
                user: req.session.user,
                admin: req.session.admin,
                achats : achats
            })
        }else {
            res.redirect('../')
        }

    });

router.route('/deconnexion')
    .get((req, res) => {
        req.session.user = undefined
        res.redirect('../')
    })