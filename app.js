if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
// console.log(process.env.secret);
const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const ExpressError=require("./utils/ExpressError");

const userRoutes=require('./routes/user.js');
const campgroundRoutes=require('./routes/campground.js');
const reviewRoutes=require('./routes/reviews.js');
const MongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const MongoStore = require('connect-mongo');

 const MongdbUrl= process.env.MongoDburl;

 async function main() {
  await mongoose.connect(MongdbUrl)
  
  .then(()=>{console.log('Mongodb connection open');});
}       
main().catch(err => console.log(err));

const secret=process.env.secret || 'Thisisasecret';
const store=MongoStore.create({
  mongoUrl:MongdbUrl,
  secret,
  touchAfter:24*60*60
});
store.on("error",function(e){
  console.log("session store error",e)
})


const sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httponly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,//set the sessionid to be expired after a certain time.
        maxAge:1000*60*60*24*7 // the same things without date.now() 
    }

};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(MongoSanitize({replaceWith:'_'}));
passport.use(new LocalStrategy(User.authenticate()));//we are telling passport to use localStrategy we have download to use the authenticate method on user.js




passport.serializeUser(User.serializeUser());//serialization refers to how do we store user data in the session and deserialize refers to how to we get the user data out of the session.
passport.deserializeUser(User.deserializeUser());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdnjs.cloudflare.net",
    "https://cdn.jsdelivr.net",
    "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
    "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
  ];
  const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.2/font/bootstrap-icons.min.css",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    
  ];
  const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
  ];
  const fontSrcUrls = ["https://cdnjs.cloudflare.com",];
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/dhzmrsso5/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
          "https://images.unsplash.com",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
      },
    })
  );


 
  
   

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

app.use((req,res,next)=>{
    res.locals.messages=req.flash();
    res.locals.currentUser=req.user;
    next();
})
// app.get('/fakeuser',async(req,res)=>{
//     const user=new User({email:'godfist1234@gmail.com',username:'phyoMyatOo'});// we don't pass in password here we gonna use register() method of passport local mongoose
//     const newUser=await User.register(user,'123456')// user.register take entire instance of user model and set a password after hashing automatically using Pbkdf2 instead of bcrypt cuz it is platform independent
//     res.send(newUser);
// })
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);// by default id can't be accepted in reviews.js cause of express .we need to allow with mergeParams 

app.get('/',(req,res)=>{
    // console.log(req.query);
    res.render('home');
});


app.all("*",(req,res,next)=>{
    next(new ExpressError('page not found',404));
})

app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message)err.message='Oh No something went wrong';
    res.status(statusCode).render('error',{err});
    // res.send("oh no something went wrong")
})
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`serving on port`);

})
