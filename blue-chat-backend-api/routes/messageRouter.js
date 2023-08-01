const express=require('express');
const messageController=require('../controllers/messageController');

const router=express.Router();

router.post('/sendMessage',messageController.createmessage);
router.get('/allmessages',messageController.findmessags);

module.exports=router;