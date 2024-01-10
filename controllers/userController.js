const User = require("../models/userModel");
const bcrypt = require('bcrypt');

const securePassword = async(password) =>
{
    try
    {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const loadLogin = async(req,res) =>
{
    try
    {
        res.render('login');
    }
    catch(error)
    {
        console.log(error.message);
    }
}

// Verify Login.

const verifyLogin = async(req,res) =>
{
    try
    {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({
            $or: [
                {email: email},
                {name: email}
            ]
        });

        if(userData)
        {
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch)
            {
                req.session.user_id = userData._id;
                res.redirect('/home');
            }
            else
            {
                res.render('login',{message:"Invalid password"});
            }
        }
        else
        {
            res.render('login',{message:"User not registered"});
        }
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const loadSignup = async(req,res) =>
{
    try
    {
        res.render('signup');
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const loadHome = async(req,res) =>
{
    try
    {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{ user:userData});
    }
    catch(error)
    {
        console.log(error.message);
    }
}

// const insertUser = async(req,res) => 
// {
//     try
//     {
//         const spassword = await securePassword(req.body.password);
//         const user = new User({
//             name: req.body.name,
//             email: req.body.email,
//             mobile: req.body.mobile,
//             password: spassword,
//             is_admin:0
//         });

//         const userData = await user.save();
        
//         if(userData)
//         {
//             res.render('signup',{message:"registration successfull,You can now login"});
//         }
//         else
//         {
//             res.render('signup',{message:"registration failed"});
//         }

//     }
//     catch(error)
//     {
//        console.log(error.message);
//     }
// }

const insertUser = async (req,res) =>
{
    try
    {
        const email = req.body.email;
        const namee = req.body.name;
        const finduser = await User.findOne({email: email});
        const findUserByName = await User.findOne({name: namee});
        if(finduser)
        {
            req.flash('exist','Email Already taken, try an other one :)');
            res.redirect('/signup');
        }
        else if(findUserByName)
        {
            req.flash('userNameExist','username already taken, try an other one :)');
            res.redirect('/signup');
        }
        else
        {
            const spassword = await securePassword(req.body.password);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: spassword,
                is_admin:0
            });

            const userData = await user.save();
        
            if(userData)
            {
                // res.render('login',{message:"registration successfull,You can now login"});
                res.redirect('/login');
            }
            else
            {
                res.render('login',{message:"registration failed"});
            }

        }
    }
    catch(error)
    {
        console.log(error.message);
    }

}

const userLogout = async(req,res) =>
{
    try
    {
        req.session.destroy();
         res.render('login',{message:"Logout Successfully"});
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports = 
{
    loadLogin,
    loadSignup,
    insertUser,
    verifyLogin,
    loadHome,
    userLogout
}