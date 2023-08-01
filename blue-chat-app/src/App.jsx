import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import RegisterUser from './components/RegisterUser'
import axios from 'axios'
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { useEffect, useState } from 'react';
import {context} from './context';

function App() {

  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;

  const [User, setUser] = useState(null);

  useEffect(() => {

    async function fetuser() {

      try {

        const { data } = await axios.get('/user/loaduser');

        console.log(data.user);

        setUser(data.user);


      }
      catch (error) {

        console.log(error);

        console.log('something went wrong');


      }
    }

    fetuser();

  }, [])

  return (
    <context.Provider value={{User,setUser}}>
      <BrowserRouter>
        <Routes>
          <Route index path='' element={<LoginPage></LoginPage>}></Route>
          <Route index path='register' element={<RegisterUser></RegisterUser>}></Route>
          <Route path='login' element={<LoginPage></LoginPage>}></Route>
          <Route path='chat' element={<ChatPage></ChatPage>}></Route>
        </Routes>
      </BrowserRouter>
    </context.Provider>
  )
}

export default App
