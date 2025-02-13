const express=require('express');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose');
const app=express();
const userRouter=require('./routes/userRouter');
const messageRouter=require('./routes/messageRouter');
const dotenv=require('dotenv').config();
const cors=require('cors');
const server = require('http').createServer(app);

app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL).then((data)=>{

    console.log('connected to database successfully');

    })
    .catch((err)=>{


        console.log(err);
    })

app.use('/user',userRouter);
app.use('/message',messageRouter);


app.use('/', (req, res) => {

    res.send('<h1>welcome to our website</h1>')
})

const users=new Map();
const io=require('socket.io')(server,{

    cors:{
        origin:process.env.CLIENT_URL,
        credentials:true
    }
});

io.on('connection',(socket)=>{

    console.log('someone got connected');


    socket.on('send-message',(data)=>{

        console.log(data);

        if(users.get(data.to)){

            socket.to(users.get(data.to)).emit('receive-message',data);
        }
    })

    socket.on('add-user',(data)=>{

        users.set(data,socket.id);

        console.log(data);
    })

    socket.on('disconnect',(data)=>{
        console.log('someone got disconnected');
    })
})

server.listen(process.env.SERVER_PORT,()=>{console.log(`server is On ${process.env.SERVER_PORT}`)});



