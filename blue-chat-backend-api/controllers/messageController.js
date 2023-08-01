const Message=require('../models/messageModel');

exports.createmessage=async(req,res,next)=>{

    const message=await Message.create(req.body);

    return res.status(200).json({

        success:true,
        message:'message send'
    })

}

exports.findmessags=async(req,res,next)=>{

    const {from,to}=req.query;

    const messages=await Message.find({$or:[
        {from,to},{from:to,to:from}
    ]});

    return res.status(200).json({

        success:true,
        message:'message found',
        messages
    })

}