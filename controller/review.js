const Campground=require('../models/campground');
const Review=require('../models/review');


module.exports.createReview=async(req,res)=>{
    // res.send('You Made it');
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    review.author=req.user._id;
    await review.save();
    await campground.save();
    req.flash('success',"successfully make a review");
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.DestroyReview=async(req,res)=>{
    const {id,reviewID}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewID}})
    await Review.findByIdAndDelete(reviewID);//we delete review but we still need to delete object id in campground.
    req.flash('delete',"successfully deleted a review");

    res.redirect(`/campgrounds/${id}`);

};