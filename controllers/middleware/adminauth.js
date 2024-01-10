const isLogin=async(req,res,next)=>
{
    try{
        if(req.session.userid)
        {
            next();
        }
        else
        {
            res.redirect('/admin/login');
        
        }
      
    }
    catch(error)
    {
        console.log(error.message)
    }
}

const isLogout= async(req,res,next) =>
{
    try
    {
        if(req.session.userid)
        {
            return res.redirect('/admin/home');
        }
      
        next();

    }
    catch(error)
    {
        console.log(error.message)
    }
}

const userInsrt = 

module.exports =
{
    isLogin,
    isLogout
}