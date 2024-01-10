const express = require("express");
const user_Route = express();
const session = require("express-session");

const userController = require("../controllers/userController");
const config = require("../config/config");
const auth= require("../middleware/auth");

const exAuth =  require("../middleware/adminauth");

user_Route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false
}));

user_Route.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });

user_Route.use(express.json());
user_Route.use(express.urlencoded({extended:true}));

// view engine.
user_Route.set('view engine','ejs');
user_Route.set('views','./views/user');

user_Route.get('/',exAuth.isLogout,auth.isLogout,userController.loadLogin);
user_Route.get('/login',exAuth.isLogout,auth.isLogout,userController.loadLogin);
user_Route.post('/',userController.verifyLogin);
user_Route.post('/login',userController.verifyLogin);
user_Route.get('/home',auth.isLogin,userController.loadHome);

user_Route.get('/signup',exAuth.isLogout,auth.isLogout,userController.loadSignup);
user_Route.post('/signup',auth.isLogout,userController.insertUser);

user_Route.get('/logout',auth.isLogin,userController.userLogout);

module.exports = user_Route;
