const isLogin = async(req,res,next) =>
{
    try
    {
        if(req.session.user_id){
            next();
                }
        else
        {
            res.redirect('/login');
        }
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next) =>
{
    try
    {
        if(req.session.user_id)
    {
        return res.redirect('/home');
    }
    next();
    }
    catch(error)
    {
        console.log(error.message);
    }
}





module.exports = 
{
    isLogin,
    isLogout
}



let arr = ["mishal","sahal",5,8,{name:"mishal"}, [8,5,7]];