import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { context } from '../context';
import { io } from 'socket.io-client';

const ChatPage = () => {
    const navigate = useNavigate();
    const { User, setUser } = useContext(context);
    const [currentuser, setcurrentuser] = useState(null);
    const [currentusername, setcurrentusername] = useState(null);
    const [loading, setloading] = useState(true);
    const [allusers, setallusers] = useState([]);
    const [messages, setmessages] = useState([]);
    const id = useRef(1);
    const scrollRef=useRef(null)
    const messageInput = useRef(null);
    const Socket = useRef();
    const logouthandler = async () => {

        const { data } = await axios.get('/user/logout');

        toast.success(data.message, { theme: 'dark' });

        setUser(null);
        navigate('/login');

    }

    useEffect(() => {

        async function fetchallusers() {
            try {

                const { data } = await axios.get('/user/allusers');

                setallusers(data.users);

                setloading(false);
            }
            catch {

                toast.error('some error occured while loading users please reload');
                setloading(false);
            }
        }
        fetchallusers();

        Socket.current = io('http://localhost:8000');

    }, [])

    useEffect(() => {
        if (User) {
            Socket.current.emit('add-user', User._id);
        }
    }, [User])

    useEffect(() => {
        if (User) {

            console.log(User);
        }
    }, [User])

    useEffect(() => {

        const fetchmessages = async () => {

            try {


                const { data } = await axios.get(`/message/allmessages?from=${currentuser}&&to=${User._id}`);

                setmessages((data.messages));

                console.log('messages fetched successfully');


            }
            catch {


                console.log('some error occured');

            }
        }

        if (currentuser && User) {

            fetchmessages();

        }


    }, [currentuser, User])

    const messagehandler = async () => {

        console.log(messageInput.current.value);

        const msg = {

            from: User._id,
            to: currentuser,
            message: messageInput.current.value
        }



        try {

            await axios.post('/message/sendMessage', msg, {

                headers: {
                    'Content-Type': 'application/json'
                }

            })

            setmessages((messages) => [...messages, { ...msg, _id: id.current }]);

            id.current = id.current + 1;

        }
        catch {

            console.log('something went wrong');

        }

        Socket.current.emit('send-message', msg);

        messageInput.current.value = "";
    }

    useEffect(() => {

        if (Socket.current) {

            Socket.current.on('receive-message', (msg) => {

                if (msg && msg.from === currentuser) {

                    setmessages((messages) => [...messages, { ...msg, id: id.current }]);

                    id.current = id.current + 1;
                }
            })


        }
    }, [currentuser])

    useEffect(()=>{

        if(scrollRef.current){
            scrollRef.current.scrollIntoView({behavior:'smooth'})
        }
    },[messages])

    return (
        <>
            {(loading) ? (<div>Loading...</div>) : <div className='h-screen flex p-0 '>
                <div className='w-1/3 bg-blue-300 h-full m-0 flex flex-col items-center box-border'>
                    <div className='w-[100%] h-[10%] text-4xl text-slate-600 font-bold text-center bg-slate-300 py-2 '><ChatBubbleIcon sx={{ fontSize: '3.5rem', color: 'blue' }}></ChatBubbleIcon><span className='text-blue-700 text-5xl'>Blue </span>Chat</div>
                    <div className='rounded-lg text-3xl text-blue-700 font-bold text-center mt-4 py-3 px-20'>Contacts</div>
                    <div className=' h-[80%] w-full box-border mt-4 flex flex-col items-center'>
                        <>
                            {allusers && allusers.map((data) => {
                                if (User&&data._id !== User._id) {

                                    return <div key={data._id} className={(data._id === currentuser) ? 'h-[13%] w-[65%] bg-blue-200 my-1 flex rounded-xl box-border justify-between cursor-pointer' : 'h-[13%] w-[65%] bg-slate-200 my-1 flex rounded-xl box-border justify-between cursor-pointer'} onClick={() => { setcurrentuser(data._id); setcurrentusername(data.username) }}>
                                        <div className='w-[20%] bg-slate-200 m-1 rounded-xl text-6xl text-slate-500 box-border px-3'>
                                            {data.username[0].toUpperCase()}
                                        </div>
                                        <div className='text-3xl w-[70%] text-start px-1 py-3 text-purple-700 font-bold'>
                                            {data.username}
                                        </div>
                                    </div>

                                }
                                else{
                                    return ''
                                }
                            })}
                        </>
                    </div>
                    <div className=' bg-slate-200 px-8 py-2 text-3xl mb-10 font-bold text-slate-700 rounded-xl flex items-center cursor-pointer' onClick={logouthandler}><LogoutIcon sx={{ fontSize: '2.3rem', color: 'grey',marginRight:'8px' }}></LogoutIcon> Logout</div>
                </div>
                <div className='w-2/3 bg-blue-500 h-full m-0 flex  flex-col justify-between'>
                    <div className='w-[100%] h-[10%] text-4xl text-slate-300 font-bold text-center bg-slate-200 py-2 '><div className='text-blue-700'>{currentusername}</div></div>
                    <div className='h-[620px] bg-slate-100 flex flex-col max-h-[620px] overflow-scroll' >

                        <>
                            {messages && messages.map((data) => {
                                if (data.from === User._id) {
                                    return <div key={data._id} className='flex flex-row-reverse'><div className=' bg-blue-300 px-4 py-4 text-xl rounded-2xl my-4 mx-3'>{data.message}</div></div>
                                }
                                else {
                                    return <div key={data._id} className='flex flex-row'><div className=' bg-slate-300 px-4 py-4 text-xl rounded-2xl my-4 mx-3 float-left'>{data.message}</div></div>
                                }
                            })}
                        </>
                        <div ref={scrollRef} ></div>
                    </div>
                    <div className='bg-blue-100 flex h-[60px] border-2 border-blue-800 rounded-md'>
                        <input type='text' ref={messageInput} placeholder='Enter Message here...' className='h-[100%] flex-grow px-2 text-xl bg-slate-300 text-slate-600 placeholder:text-blue-800 placeholder:text-xl focus:outline-none'></input>
                        <div className='w-[6%] flex items-center justify-center bg-blue-300 rounded-md' onClick={messagehandler}><SendIcon sx={{ fontSize: '2rem', color: 'black' }}></SendIcon></div>
                    </div>
                </div>
            </div>}
        </>
    )
}


export default ChatPage