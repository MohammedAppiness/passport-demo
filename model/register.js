const mongoose=require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const {Schema}=mongoose;

const registerSchema=new Schema({
    email: {type: String, required:[true,"email can't be blank"], unique:true},
    username : {type: String, unique: true, required:[true,"username can't be blank"]}
})



registerSchema.plugin(passportLocalMongoose)



const register=mongoose.model('register',registerSchema);

module.exports=register;