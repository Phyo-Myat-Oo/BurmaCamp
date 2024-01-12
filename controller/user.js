const User=require('../models/user');
module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
};

module.exports.createUser=async(req,res)=>{
    try{
    const {email,username,password}=req.body;
    const user=new User({email,username});
   const registeredUser=await User.register(user,password) //use new User we made and use register method to store password
//    console.log(registeredUser);
 req.login(registeredUser,err=>{
    if(err) return next(err);
    req.flash('success',"Welcome to Burma Camp");
    res.redirect('/campgrounds');
 })  
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }
   
};

module.exports.LoginUser=(req,res)=>{
    req.flash('success',"welcome back");
    const redirectUrl=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;// we don't want the url to be keep storing in the session
    res.redirect(redirectUrl);

};
module.exports.RenderLogin=(req,res)=>{
    res.render('users/login')
    };

module.exports.LogoutUser=(req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      // if you're using express-flash
      req.flash('success', 'successfully loggout');
      res.redirect('/campgrounds');
    });
  };