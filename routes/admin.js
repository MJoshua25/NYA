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

const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, 'img-' + Date.now() +'.jpg')
    }
})

var upload = multer({storage: storage})
var f_post = upload.fields([{name:'m_image', maxCount:5}, {name:'m_plan', maxCount:5}])

router.route('/')
    .get((req, res) => {
        if (req.session.admin != undefined)
            res.redirect('../admin/dashboard')
        else
            res.redirect('../admin/connexion')
    });

router.route('/connexion')
    .get((req, res) => {
        res.render('admin/connexion.twig')
    })

    .post(async (req, res) =>{
        req.session.admin = await Admin.get(req.body.email)
        req.session.user = undefined
        res.redirect('../admin/dashboard')
    });

router.route('/dashboard')
    .get(async (req, res) => {
        let params = await Maison.getAnnual()
        let aux = await Maison.getMensual()
        params.mensual_gain = aux.mensual_gain
        params.mensual_sell = aux.mensual_sell
        params.binding_contact = await Contact.getBinding()
        params.mensual_contact = await Contact.getContact()
        res.render('admin/dashboard.twig', {params: params})
    });

router.route('/maison')
    .get(async (req, res) => {
        let maisons = await Maison.getAllMaison()
        let styles = await Maison.getAllStyle()
        res.render('admin/maison.twig', {maisons:maisons, styles: styles})
    })

    .post(f_post, async (req, res) => {
        let maison = await Maison.addMaison(req.body.m_nom, req.body.m_type, req.body.m_style, req.body.m_longueur, req.body.m_largeur, req.body.m_chambre, req.body.m_bain, req.body.m_prix, req.body.m_estimation, req.body.m_description)
        req.files['m_image'].forEach(async img => await Maison.addImg(maison, img.filename))
        req.files['m_plan'].forEach(async img => await Maison.addPlan(maison, img.filename))
        res.redirect('../maison/' + maison)
    });
 
router.route('/deconnexion')
    .get((req, res) => {
        req.session.admin = undefined
        res.redirect('../admin')
    })

router.route('/contact')
    .get(async (req, res) => {
        let contacts = await Contact.getAll()
        res.render('admin/contact', {contacts : contacts })
    });

router.route('/contact/:id')
    .get(async (req, res) => {
        let valide = await Contact.setView(req.params.id)
        res.redirect('../../admin/contact')
    });

router.route('/users')
    .get(async (req, res) => {
    let users = await Users.getAll()
    res.render('admin/user', {users : users})
})

router.use('*', (req, res) =>{
    res.redirect('../admin')
})