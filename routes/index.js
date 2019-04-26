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
    .get(async (req, res) =>{
        let maisons = await Maison.getAllMaison();
        res.render('index.twig', {maisons : maisons, user: req.session.user, admin: req.session.admin})
    });

router.route('/inscription')
    .post(async (req, res) =>{
        let user = await Users.add(req.body.i_nom, req.body.i_phone, req.body.i_email, req.body.i_password)
        req.session.user = user;
        res.redirect('users/')
    });

router.route('/connexion')
    .post(async (req, res) =>{
        let user = await Users.getByEmail(req.body.c_email)
        req.session.user = user;
        res.redirect('users/')
    });

router.route('/update')
    .post(async (req, res) => {
        let result = await Users.updatePassword(req.session.user.id, req.body.u_password)
        res.redirect('users/')
    })