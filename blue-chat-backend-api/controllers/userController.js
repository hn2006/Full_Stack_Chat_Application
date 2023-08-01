const User=require('../models/userModel');
const bcryptjs=require('bcryptjs');
const { sendjwttoken } = require('../utils/jwtToken');
const jwt=require('jsonwebtoken');

exports.registerUser=async(req,res,next)=>{

    const {username,password}=req.body;

    let user=await User.findOne({username});

    if(user){

        console.log('error');

        return res.status(401).json({
            success:false,
            message:'username is already in use please enter different username'
        })
    }

    let encryptedPassword=await bcryptjs.hash(password,10);
    
    const newuser=await User.create({username,password:encryptedPassword});

    sendjwttoken(newuser,res);

}

exports.loginUser=async(req,res,next)=>{

    const {username,password}=req.body;

    let user=await User.findOne({username}).select('+password');

    if(user){

        const decryptpassword=await bcryptjs.compare(password,user.password);

        if(decryptpassword){

           return sendjwttoken(user,res);

        }

        
    }

    return res.status(401).json({
        success:false,
        message:'invalid username and password'
    })
}


exports.logOut = async (req, res, next) => {

    res.cookie('token', null, {

        expires: new Date(Date.now()),
        httpOnly: true
    })

    return res.status(200).json({ success: true, message: "logout successful" });
}

exports.loaduser=async(req,res,next)=>{

    const { token } = req.cookies;

    if (!token) {

        return res.status(401).json({
            success:false,
            message:'Failed to load the user'
        });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({_id:decodedData.id});

    return res.status(200).json({
        success:true,
        message:'user fetched successfully',
        user
    })

}
exports.getallusers=async(req,res,next)=>{

    const users = await User.find();

    return res.status(200).json({
        success:true,
        message:'users fetched successfully',
        users
    })

}