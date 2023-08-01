import axios from 'axios';
import {useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { context } from '../context';

const LoginPage = () => {


    const [user,setuser]=useState({username:'',password:''});
    const loginButton=useRef(null);
    const navigate=useNavigate();
    const {User,setUser:setUserdetails}=useContext(context);

    useEffect(()=>{

        if(User){

            navigate('/chat');
        }
        

    },[navigate,User])

    const userhandler=(e)=>{

        setuser({...user,[e.target.name]:e.target.value});

        console.log(user);
    }
    const submithandler=async()=>{

        loginButton.current.disabled=true;

        
        try{

            const {data}=await axios.post('/user/login',user,{
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            console.log(data);

            setUserdetails(data.user);
        }

        catch(error){

            console.log(error);

            toast.error(error.response.data.message,{theme:'dark'});

            loginButton.current.disabled=false;

        }

    }
    return (
        <div className='h-screen flex justify-center items-center bg-blue-200'>
        {console.log(User)}

            <div className='w-[300px] justify-center items-center'>
                <h1 className='text-center text-5xl mb-6 font-semibold text-blue-800'>Sign In</h1>
                <input name='username' value={user&&user.username} type='text' placeholder='Username' className='focus:outline-none block  p-2 mb-2 rounded-md w-[300px]' onChange={userhandler}></input>
                <input name='password' value={user&&user.password} type='password' placeholder='Password' className='focus:outline-none block  p-2 mb-2 rounded-md w-[300px] ' onChange={userhandler}></input>
                <button ref={loginButton} className='w-full bg-purple-500 text-1xl py-2 text-white rounded-md' onClick={submithandler}>Login</button>
                <div className='mt-4 p-2 text-center text-black'>New to the App? <Link className='text-blue-800 text-xl'  to={'/register'}>Register</Link> Here</div>
            </div>
        </div>
    )
}

export default LoginPage