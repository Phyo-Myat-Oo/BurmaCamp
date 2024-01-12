const ExpressError=require("./utils/ExpressError");
const {campgroundSchema,reviewSchema}=require('./schema');
const Campground=require('./models/campground');
const Review=require('./models/review');
module.exports.isLoggedin=(req,res,next)=>{
    // console.log('Request user...',req.user);
     req.session.returnTo=req.originalUrl;// the url we want to route the user back to
    if(!req.isAuthenticated()){
    req.flash('error','you must be signed in');
    return res.redirect('/login');
}
next();
}


module.exports.validateCampground=(req,res,next)=>{
    const{error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
         }
    else{
    next();
    }
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewID}=req.params;
    const review=await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
         }
    else{
    next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    const{error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();  
    }
}