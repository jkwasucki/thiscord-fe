'use client'

import { useState } from 'react'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'

export default function Home() {
    const [authState,setAuthState] = useState('login')
    
  return (
    <main className='fixed flex justify-center items-center w-[100vw] h-[100vh]'>
        {authState === 'login' ? 
            <Login authState={setAuthState}/> 
            : 
            <Register authState={setAuthState}/>
        }
    </main>
  )
}
