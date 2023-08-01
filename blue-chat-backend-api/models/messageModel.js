const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({

    from:{

        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    to:{

        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Message',messageSchema);