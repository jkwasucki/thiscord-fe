'use client'
import { createSession } from '@/redux/userSlice'
import { createAlert } from '@/redux/alertSlice'
import { login } from '@/functions/handlers'
import { motion } from 'framer-motion'
import ForgotCreds from '../Modals/ForgotCreds'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import {FcGoogle} from 'react-icons/fc'
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken'
import useSession from '@/utils/useSession'
import socket from '@/lib/socket'
import TooltipLeft from '../Tooltips/TooltipLeft'

type Props = {
    authState:Dispatch<SetStateAction<string>>
}

export default function Login({authState}:Props) {
    const session = useSession()
    const router = useRouter()
    const dispatch = useDispatch()
    
    const [inputFocusEmail,setInputFocusEmail] = useState('1e2124')
    const [inputFocusPassword,setInputFocusPassword] = useState('1e2124')
  

    const [forgotCreds,setForgotCreds] = useState<boolean>(false)
    const [credentials,setCredentials] = useState({
        email:'',
        password:''
    })

    async function handleLogin(){
        try {
            const user = await login(credentials)
            dispatch(createSession(user.data))
            if(localStorage.getItem('redirectAfterwards')){
                    const redirect = localStorage.getItem('redirectAfterwards')
                    router.push(redirect!)
                    localStorage.removeItem('redirectAfterwards')
            }else{
               
                socket.emit('join',session._id);
                socket.emit('active',{text:'active',_id:session._id})

                router.push(`/servers/me/session/${user.data._id}`)
            }
        } catch (error:any) {
            if(error.response.data.includes('not found')){
                setInputFocusEmail('b91c1c')
            }else if(error.response.data.includes('provide both')){
                setInputFocusEmail('b91c1c')
                setInputFocusPassword('b91c1c')
            }
            dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }
   
  return (
    <>
        <motion.div 
            initial={{ opacity: 0, y:-5 }}
            animate={{ opacity: 1,y:0}}
            transition={{ duration: 0.5}}
            className='relative flex flex-col items-center w-[350px] h-[450px] bg-[#36393e] rounded-lg shadow-xl p-3'
            >
            <motion.div  
                whileHover={{ scale: 1.2 }} 
                className='z-10 cursor-pointer absolute right-[-15px]'
            >
                <div className='relative group'>
                    <FcGoogle size={40} className='hover:text-gray-500'/>
                    <TooltipLeft text='Currently not possible'/>
                </div>
            </motion.div>
            <p className='text-[30px] text-slate-300 font-thin'>Welcome back!</p>
            <p className='text-slate-400 font-thin'>That's so cool you showed up!</p>
            <div className='flex flex-col w-full p-3 gap-5 text-slate-300'>
                <div className='flex flex-col gap-2'>
                    <p className='text-sm'>EMAIL</p>
                    <div className='w-full h-12 bg-[#282b30] border-[1px]' style={{ borderColor: `#${inputFocusEmail}` }}>
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
                    <div className='w-full h-12 bg-[#282b30] border-[1px]'  style={{ borderColor: `#${inputFocusPassword}` }}>
                        <input 
                            onChange={(e)=>setCredentials((prev)=>({...prev,password:e.target.value}))} 
                            onBlur={()=>setInputFocusPassword('1e2124')} 
                            onFocus={()=>setInputFocusPassword('15803d')} 
                            type='password' 
                            className='px-2 w-full h-full bg-transparent outline-none'
                        />
                    </div>
                </div>
                <p 
                    onClick={()=>setForgotCreds(true)} 
                    className='text-sm opacity-50 cursor-pointer hover:opacity-80 w-max'
                >
                    I forgot my credentials
                </p>
                <div
                    onClick={handleLogin} 
                    className='cursor-pointer flex items-center justify-center w-full h-12 bg-green-700 rounded-lg'
                >
                    <p>Login</p>
                </div>
                <div className='flex items-center gap-1'>
                    <p className='opacity-50'>Need an account?</p>
                    <p 
                        onClick={()=>authState('register')} 
                        className='text-green-700 cursor-pointer'
                    >
                        Register
                    </p>
                </div>
            </div>
        </motion.div>
        {forgotCreds && <ForgotCreds onClose={setForgotCreds}/>}
    </> 
  )
}
