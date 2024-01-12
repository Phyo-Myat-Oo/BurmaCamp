const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
UserSchema.plugin(passportLocalMongoose);// this is gonna add username and password and futher method to our schema.
module.exports=mongoose.model('User',UserSchema);