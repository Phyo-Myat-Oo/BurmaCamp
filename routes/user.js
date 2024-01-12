const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/CatchAsync');

const passport=require('passport');
const user=require('../controller/user');

router.route('/register')
.get(user.renderRegister)
.post(catchAsync(user.createUser));

router.route('/login')
.get(user.RenderLogin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login', keepSessionInfo: true}),user.LoginUser)

router.get('/logout', user.LogoutUser);
 
module.exports=router;