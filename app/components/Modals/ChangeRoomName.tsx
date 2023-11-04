'use client'
import { createAlert } from '@/redux/alertSlice';
import { useServerContext } from '../Providers/ServerEventProvider';
import { changeRoomName } from '@/functions/handlers';
import { motion } from 'framer-motion';
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { useScreenWidth } from '../Providers/MobileWrapper';

type Props = {
    toggler:React.Dispatch<React.SetStateAction<{
        status: boolean;
        roomId: string;
    }>>,
    serverId:string,
    channelId:string,
    roomId:string
}

export default function ChangeRoomName({toggler,roomId,serverId,channelId}:Props) {
    const dispatch = useDispatch()
    const { shakeServer } = useServerContext()
    const isMobile = useScreenWidth()

    const [formattedRoomName,setFormattedRoomName] = useState('')

    const handleRoomNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value;
        setFormattedRoomName(inputText.replace(/\s+/g, '-'));
      };

    async function handleChangeName(){
        if(formattedRoomName.length > 0){
            try {
                await changeRoomName(serverId,channelId,roomId,formattedRoomName)
                shakeServer()
                toggler((prev)=>({...prev,status:false,roomId:""}))
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        } 
    }

  return (
    <div className={`${isMobile && 'p-3'} bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-40`}>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.2, ease: "easeOut" }} 
            className='relative flex flex-col items-center w-[400px] bg-[#36393e] rounded-lg gap-5 p-5 text-slate-300 shadow-xl'
            >
            <div className='absolute right-0 top-0 p-3 cursor-pointer'>
                <AiOutlineClose onClick={toggler}/>
            </div>
            <div className='flex flex-col justify-end w-full'>
                <p className='text-2xl font-semibold'>Edit room name</p>
            </div>
            
            <div className='w-full h-full flex flex-col items-start gap-2'>
                <div className='cursor-pointer pl-5 flex items-center justify-start w-full h-[50px] bg-[#282B30] rounded-md shadow-lg gap-2'>
                    <p className='text-xl'>#</p>
                    <input 
                        placeholder='New-room-name'
                        type='text'
                        value={formattedRoomName}
                        onChange={handleRoomNameInput} 
                        className='w-full h-full bg-transparent outline-none text-xl'
                    />
                </div>
            </div>
            <div 
                onClick={handleChangeName} 
                className='cursor-pointer flex items-center justify-center w-[150px] h-[50px] bg-green-700 rounded-md'
            >
                <p>Edit</p>
            </div>
        </motion.div>
    </div>
  )
}
