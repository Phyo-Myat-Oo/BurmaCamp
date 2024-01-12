const express=require('express');
const router=express.Router();
const CatchAsync=require('../utils/CatchAsync');
const {isLoggedin,validateCampground,isAuthor}=require('../middleware.js');
const campground=require('../controller/campground.js');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});

router.route('/')
.get(CatchAsync(campground.index))
.post(isLoggedin,upload.array("images"),validateCampground,CatchAsync(campground.createCampground));

router.get('/new',isLoggedin,campground.new);

router.route('/:id').get(CatchAsync(campground.showCampground))
.put(isLoggedin,isAuthor,upload.array("images"),CatchAsync(campground.updateCampground))
.delete(isLoggedin,CatchAsync(campground.DestroyCampground));

router.get('/:id/edit',isLoggedin,isAuthor,CatchAsync(campground.renderEditForm))
module.exports=router;
