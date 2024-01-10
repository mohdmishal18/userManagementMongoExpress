const express = require('express');
const admin_Route = express();

const session = require('express-session');
const config = require('../config/config');

const adminController = require('../controllers/adminController');

const auth = require("../middleware/adminauth");
const exAuth = require("../middleware/auth");

admin_Route.use(express.json());
admin_Route.use(express.urlencoded({extended:true}));

admin_Route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false
}));

// view engine.
admin_Route.set('view engine','ejs');
admin_Route.set('views','./views/admin');

admin_Route.get('/login',exAuth.isLogout,auth.isLogout,adminController.loadLogin);

admin_Route.post('/login',adminController.verifyLogin);

admin_Route.get('/home',auth.isLogin,adminController.loadHome);
admin_Route.get('/logout',auth.isLogin,adminController.adminLogout);

admin_Route.get('/new-user',auth.isLogin,adminController.newUserLoad);
admin_Route.post('/new-user',adminController.addUser)

admin_Route.get('/edit-user',auth.isLogin,adminController.editUserLoad);

admin_Route.post('/edit-user',adminController.updateUsers);

admin_Route.get('/delete-user',adminController.deleteUser)

module.exports = admin_Route;