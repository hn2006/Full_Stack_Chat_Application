import axios from 'axios';
import {useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { context } from '../context';

const RegisterUser = () => {


    const [user,setuser]=useState({username:'',password:''});
    const registerButton=useRef(null);
    const {User,setUser:setUserdetails}=useContext(context);
    const navigate=useNavigate();

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

        // registerButton.current.disabled=true;

        
        try{

            const {data}=await axios.post('user/register',user,{
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            console.log(data);
            setUserdetails(data.user);
        }

        catch(error){

            toast.error(error.response.data.message,{theme:'dark'});

            registerButton.disabled=false;

        }

    }
    return (
        <div className='h-screen flex justify-center items-center bg-blue-200'>

            <div className='justify-center items-center box-border rounded-md'>
                <h1 className='text-center text-5xl mb-6 font-semibold text-blue-800'>Register</h1>
                <input name='username' value={user&&user.username} type='text' placeholder='Username' className='block mx-2  p-2 mb-2 rounded-md w-[300px]' onChange={userhandler}></input>
                <input name='password' value={user&&user.password} type='password' placeholder='Password' className='block mx-2 p-2 mb-2 rounded-md w-[300px] ' onChange={userhandler}></input>
                <button ref={registerButton} className='w-[300px] bg-purple-500 text-1xl py-2 text-white rounded-md mx-2' onClick={submithandler}>Register</button>
                <div className='mt-4 p-2 text-center text-black'>Already Have an Account? <Link className='text-blue-800 text-xl'  to={'/login'}>SignIn</Link> Here</div>
            </div>
        </div>
    )
}

export default RegisterUser