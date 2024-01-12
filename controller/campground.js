
const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken=process.env.MAP_BOX_TOKEN; //get token from .env
const geocoder=mbxGeocoding({accessToken:mapBoxToken})//pass mapboxtoken.

module.exports.index=async(req,res,)=>{
  
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
    }
    
module.exports.new=(req,res)=>{
    res.render('campgrounds/new');
};  

module.exports.createCampground=async(req,res, next)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
  
    // if(!req.body.campground)throw new ExpressError('Invalid campground Data',400);
    const campground=new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));// if you upload 2 files ,it should just make me an array these 2 url and filename.
    
    campground.author=req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success',"successfully created a new campgroud");
    res.redirect(`/campgrounds/${campground._id}`);


};
module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({path:'reviews',populate:{
        path:'author'
    }}).populate('author');
    // console.log(campground);
     if(!campground){
        req.flash('error',"can't find campground");
        return res.redirect('/campgrounds');
    };
    res.render('campgrounds/show',{campground})};
module.exports.renderEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error',"can't find campground");
        return res.redirect('/campgrounds');
    };
    res.render('campgrounds/edit',{campground});
};
module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...imgs);// if you u pload 2 files ,it should just make me an array these 2 url and filename.'...imgs don't push in an array just pass in their argument.
    await campground.save();

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages  ){
            await cloudinary.uploader.destroy(filename);
        }
    await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
    console.log(campground);
    }
    
    req.flash('success',"successfully updated campground")
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.DestroyCampground=async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id,{...req.body.campground});
    req.flash('success',"successfully deleted campground")
    res.redirect(`/campgrounds`);
};