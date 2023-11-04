'use client'
import { register } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import { motion } from 'framer-motion'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'

type Props = {
    authState:Dispatch<SetStateAction<string>>
}

export default function Register({authState}:Props) {
    const dispatch = useDispatch()
    const [inputFocusEmail,setInputFocusEmail] = useState('1e2124')
    const [inputFocusPassword,setInputFocusPassword] = useState('1e2124')

    const [credentials,setCredentials] = useState({
        email:'',
        password:''
    })

    async function handleRegister(){
        try {
            await register(credentials)      
            authState('login')
        }catch(error:any) {
            if(error.response.data.includes('Password')){
                setInputFocusPassword('b91c1c')
            }else if(error.response.data.includes('exists')){
                setInputFocusEmail('b91c1c')
            }
            dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }

  return (
    <motion.div 
        initial={{ opacity: 0, y:-5 }}
        animate={{ opacity: 1,y:0}}
        transition={{ duration: 0.5}} 
        className='flex flex-col items-center w-[350px] h-[400px] bg-[#36393e] rounded-lg shadow-xl p-3'
        >
        <p className='text-[30px] text-slate-300 font-thin'>Come Join Us!</p>
        <p className='text-slate-400 font-thin'>It's going to be great!</p>
        <div className='flex flex-col w-full p-3 gap-5 text-slate-300'>
            <div className='flex flex-col gap-2'>
                <p className='text-sm'>EMAIL</p>
                <div className={`w-full h-12 bg-[#282b30] border-[1px]`} style={{ borderColor: `#${inputFocusEmail}` }}>
                    <input 
                        value={credentials.email} 
                        onChange={(e)=>setCredentials((prev)=>({...prev,email:e.target.value}))} 
                        onBlur={()=>setInputFocusEmail('1e2124')} 
                        onFocus={()=>setInputFocusEmail('15803d')} 
                        type='email' 
                        className='px-2 w-full h-full bg-transparent outline-none'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-sm'>PASSWORD</p>
                <div className={`w-full h-12 bg-[#282b30] border-[1px]`}  style={{ borderColor: `#${inputFocusPassword}` }}>
                    <input 
                        onChange={(e)=>setCredentials((prev)=>({...prev,password:e.target.value}))} 
                        onBlur={()=>setInputFocusPassword('1e2124')} 
                        onFocus={()=>setInputFocusPassword('15803d')} 
                        type='password' 
                        className='px-2 w-full h-full bg-transparent outline-none'
                    />
                </div>
            </div>
            <div 
                onClick={handleRegister} 
                className='cursor-pointer flex items-center justify-center w-full h-12 bg-green-700 rounded-lg'
            >
                <p>Continue</p>
            </div>
            <div className='flex items-center gap-1'>
                <p className='opacity-50'>I already have an account!</p>
                <p 
                    onClick={()=>authState('login')} 
                    className='text-green-700 cursor-pointer'
                >
                    Login
                </p>
            </div>
        </div>
    </motion.div>
  )
}
