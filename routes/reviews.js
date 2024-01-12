const express=require('express');
const router=express.Router({mergeParams:true});
const {validateReview,isLoggedin,isReviewAuthor}=require('../middleware');
const CatchAsync=require('../utils/CatchAsync');
const review=require('../controller/review');

router.post('/',isLoggedin,validateReview,CatchAsync(review.createReview));

router.delete('/:reviewID',isLoggedin,isReviewAuthor,CatchAsync(review.DestroyReview));

module.exports=router;




