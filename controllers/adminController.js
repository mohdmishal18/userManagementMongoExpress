const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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

// Verify Login.

const verifyLogin = async(req,res) =>
{
    try
    {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({
           $or:[
            {email: email},
            {name: email}
           ]
        });

        if(userData)
        {
            const passwordMatch = await bcrypt.compare(password,userData.password);

            if(passwordMatch)
            {
                if(userData.is_admin === 0)
                {
                    res.render('login',{messageadmin:"OOPS Only admin can enter"});
                }
                else
                {
                    req.session.userid = userData._id;
                    res.redirect('/admin/home');
                }
            }
            else
            {
                res.render('login',{messageadmin:"Invalid password"});
            }
        }
        else
        {
            res.render('login',{messageadmin:"Enter a valid Entry"});
        }
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
        let search = '';

        const userData = await User.find({ is_admin:0 });
        res.render('home',{ users:userData});
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const adminLogout = async(req,res) =>
{
    try
    {
        req.session.destroy();
        res.render('login',{logout:"Logout Successfully"});
    }
    catch(error)
    {
        console.log(error.message);
    }
}

// Add new user

const newUserLoad = async(req,res) =>
{
    try
    {
        res.render('new-user');
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const addUser = async(req,res) =>
{
    try
    {
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const pasword = req.body.password;

        const spassword = await securePassword(req.body.password);

        const user = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: spassword,
            is_admin:0
        })

        const userData = await user.save();

        if(userData)
        {
            res.redirect("/home");
        }
        else
        {
            res.render("new-user",{message:"Something went wrong"});
        }
    }
    catch(error)
    {
        console.log(error.message);
    }
}

// Edit user

const editUserLoad = async(req,res) =>
{
    try
    {
        const id = req.query.id;
        const userData = await User.findById({_id: id});
        if(userData)
        {
            res.render('edit-user',{user:userData});
        }
        else
        {
            res.redirect('/admin/home');
        }
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const updateUsers = async(req,res) =>
{
    try
    {
      const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set: {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
      }});  

      res.redirect('/admin/home');
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const deleteUser = async(req,res) =>
{
    try
    {
        const id = req.query.id;
        await User.deleteOne({ _id:id });

        res.redirect('/admin/home');
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports = 
{
    loadLogin,
    verifyLogin,
    loadHome,
    adminLogout,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}