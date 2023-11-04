'use client'
import { useServerContext } from '../Providers/ServerEventProvider'
import { createChannel } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import {GiSpeaker} from 'react-icons/gi'
import { useScreenWidth } from '../Providers/MobileWrapper'


type Props = {
    serverId:string
    toggler:(value: React.SetStateAction<boolean>) => void
}

export default function CreateChannel({serverId,toggler}:Props) {
    const dispatch = useDispatch()
    const { shakeServer,shakeServerIcons } = useServerContext()
    const isMobile = useScreenWidth()
    
    const [channelName,setChannelName] = useState('')
    const [channelType,setChannelType] = useState('')

    async function handleCreateChannel(){
        if(channelName.length > 0){
            try {
                await createChannel(channelType,serverId,channelName)
                shakeServerIcons()
                shakeServer()
                toggler(false)
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }
    }

  return (
    <div className={`${isMobile && 'p-3'} bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-50 cursor-default`}>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.2, ease: "easeOut" }} 
            className='relative flex flex-col items-center justify-start w-[400px] bg-[#36393e] rounded-lg gap-5 p-5 text-slate-300 shadow-xl'
            >
            <div 
                onClick={()=>toggler(false)}
                className='absolute right-0 top-0 p-3 cursor-pointer'
            >
                <AiOutlineClose />
            </div>
            <div className='flex flex-col justify-end w-full'>
                <p className='text-2xl '>Create channel</p>
                <p className='opacity-50'>Place where your chat rooms are stored</p>
            </div>
            <div className='flex flex-col justify-start w-full gap-3'>
                <p>Channel type</p>
                <div 
                    onClick={()=>setChannelType('text')} 
                    className='hover:bg-[#424549] flex items-center justify-between gap-3 bg-[#282b30] rounded-md py-2 px-5'>
                    <p className='text-5xl'>#</p>
                    <div className='flex flex-col gap-1'>
                        <p className='font-semibold'>Text</p>
                        <p>Write and recieve messages</p>
                    </div>
                    <div className='w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center'>
                       { channelType === 'text' &&  <div className='w-4 h-4 rounded-full bg-green-700'/>}
                    </div>
                </div>
                <div
                    onClick={()=>setChannelType('voice')} 
                    className='hover:bg-[#424549] flex items-center justify-between gap-3 bg-[#282b30] rounded-md py-2 px-5'
                >
                    <GiSpeaker size={30}/>
                    <div className='flex flex-col gap-1'>
                        <p className='font-semibold'>Voice</p>
                        <p>Talk with others in voice chat</p>
                    </div>
                    <div className='w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center'>
                        {channelType === 'voice' &&  <div className='w-4 h-4 rounded-full bg-green-700'/>}
                    </div>
                </div>
            </div>
            <p className='w-full flex justify-start'>
                Displayed name
            </p>
            <div className='w-full h-full flex flex-col items-start gap-2'>
                <div className='cursor-pointer pl-5 flex items-center justify-start w-full h-[50px] bg-[#282B30] rounded-md shadow-lg gap-2'>
                    <input 
                        type='text' 
                        onChange={(e)=>setChannelName(e.target.value)} 
                        className='w-full h-full bg-transparent outline-none text-xl'
                    />
                </div>
            </div>
            <div 
                onClick={handleCreateChannel} 
                className='cursor-pointer flex items-center justify-center w-[150px] h-[50px] bg-green-700 rounded-md'
                >
                <p>Create</p>
            </div>
        </motion.div>
    </div>
  )
}
