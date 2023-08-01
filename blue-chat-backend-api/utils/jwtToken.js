const User=require('../models/userModel');

exports.sendjwttoken=(user,res)=>{

    const token=user.getJwtToken(user.id);

    
    return res.status(200).cookie('token',token,{expiresIn:new Date(Date.now+7*24*60*60*1000),

        httpOnly:true}).json({

        success:true,
        token,
        user
    })

}