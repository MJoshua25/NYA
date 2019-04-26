require('babel-register');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const config = require('./assets/config');
const mysql = require('promise-mysql');
var path = require('path');
var session = require('cookie-session')
const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, 'img-' + Date.now())
    }
})

var upload = multer({storage: storage})

mysql.createConnection(config.db)
    .then((db) =>{
        const app = express();
        let Users = require('./models/Users-class')(db);
        let Contact = require('./models/Contact-class')(db);
        let Admin = require('./models/Admin-class')(db);
        let Maison = require('./models/Maison-class')(db);
        const server = require('http').createServer(app);
        var io = require('socket.io').listen(server);

        io = require('./assets/f_socket')(Users,Maison,Admin,Contact, io)

        var indexRouter = require('./routes/index')(Users,Maison,Admin, io);
        var usersRouter = require('./routes/users')(Users,Maison,Admin, io);
        var maisonRouter = require('./routes/maison')(Users,Maison,Admin,Contact, io);
        var adminRouter = require('./routes/admin')(Users,Maison,Admin,Contact,io);

        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'twig');
        app.use(session({secret:"nya"}))
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.static(path.join(__dirname, 'public')));

        app.use(morgan('dev'));

        app.use('/users' , usersRouter);
        app.use('/maison', maisonRouter);
        app.use('/admin/', adminRouter);
        app.use('/', indexRouter);

        server.listen(config.port, () => {
            console.log("Started on port "+ config.port);
        });
    })
    .catch(err => console.log(err.message))