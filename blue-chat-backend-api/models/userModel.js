const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    }
})

userSchema.methods.getJwtToken=(userId)=>{

    const token= jwt.sign({name:'token',id:userId},process.env.JWT_SECRET_KEY,{expiresIn:'7d'});

    return token;

}

module.exports=mongoose.model('User',userSchema);