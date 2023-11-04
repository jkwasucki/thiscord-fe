'use client'
import { createAlert } from '@/redux/alertSlice';
import { sendEmail } from '@/functions/handlers';
import { motion,AnimatePresence } from 'framer-motion';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useRef } from 'react';

type Props = {
    onClose:Dispatch<SetStateAction<boolean>>
}


export default function ForgotCreds({onClose}:Props) {
    const dispatch = useDispatch()
    const [tab,setTab] = useState('tab1')
    const [email,setEmail] = useState('')

    const containerRef = useRef<HTMLDivElement | null>( null )
    useEffect(()=>{
        const handleOutSideClick = (event:MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                onClose(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
        window.removeEventListener("mousedown", handleOutSideClick);
        };
    },[containerRef])

    async function handleEmailSend(){
        try{
            await sendEmail(email)
            .then(()=>{
                setTab('tab3')
            })
        }catch(error:any){
            dispatch(createAlert({type:'error',text:error.response.data}))
        }
    }

    type Tabs = {
        [key: string]: {
          content: React.ReactNode;
        };
      };
      
    const tabs:Tabs = {
        tab1: {
          content: (
            <>
                <div className='flex items-center justify-between pr-3'>
                    <p className='text-3xl font-thin'>I forgot...</p>
                    <p 
                        onClick={()=>onClose(false)} 
                        className='cursor-pointer w-max'
                    >
                        Back
                    </p>
                </div>
                <div className='flex flex-col gap-3'>
                    <div 
                        onClick={()=>setTab('tab2')} 
                        className='cursor-pointer pl-5 flex items-center justify-start w-full h-[80px] bg-[#282B30] rounded-xl shadow-lg'
                    >
                        <p>PASSWORD</p>
                    </div>
                    <div className='cursor-not-allowed opacity-50 hover:blocked pl-5 flex items-center justify-start w-full h-[80px] bg-[#282B30] rounded-lg shadow-lg'>
                        <p>EMAIL</p>
                    </div>
                </div>
            </>
          ),
        },
        tab2: {
            content: (
                <>
                    <div className='flex items-center justify-between pr-3'>
                        <p className='text-3xl font-thin'>Enter email</p>
                        <p 
                            onClick={()=>setTab('tab1')} 
                            className='cursor-pointer w-max'
                        >
                            Back
                        </p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='cursor-pointer pl-5 flex items-center justify-start w-full h-[80px] bg-[#282B30] rounded-lg shadow-lg'>
                            <input 
                                type='email' 
                                onChange={(e)=>setEmail(e.target.value)} 
                                className='w-full h-full bg-transparent outline-none text-xl'
                            />
                        </div>
                        <p className='text-slate-300 opacity-50'>Password reset link will be sent to your inbox. </p>
                        <div className='flex justify-end mt-8'>
                            <div 
                                onClick={handleEmailSend} 
                                className='cursor-pointer flex items-center justify-center rounded-lg w-[150px] h-12 bg-green-700'
                            >
                                <p>Continue</p>
                            </div>
                        </div>
                    </div>
                </>
            ),
          },
        tab3:{
            content: (
                <>
                    <div className='flex items-center justify-between pr-3'>
                        <p className='text-3xl font-thin'>Reset link sent!</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <p>Go ahead and check your mail,<br/> you should recive your email password reset link in no time!</p>
                        <div className='flex justify-center mt-8'>
                            <div 
                                onClick={()=>onClose(false)} 
                                className='cursor-pointer flex items-center justify-center rounded-lg w-[150px] h-12 bg-green-700'
                            >
                                <p>Got it!</p>
                            </div>
                        </div>
                    </div>
                </>
            ),
        }
      }
      

  return (
   
    <div className='bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-40'>
        <AnimatePresence mode='wait'>
            <motion.div 
                key={tab} // Key ensures that Framer Motion knows it's a different component
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='gap-5 flex flex-col w-[400px] h-[300px] bg-[#36393e] text-slate-300 p-5 rounded-lg shadow-md shadow-green-900'
                ref={containerRef}
                >
                    {tabs[tab].content}
            </motion.div>
        </AnimatePresence>
    </div>
  )
}
