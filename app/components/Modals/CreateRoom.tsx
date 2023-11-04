'use client'
import { createAlert } from '@/redux/alertSlice'
import { createRoom } from '@/functions/handlers'
import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import useSession from '@/utils/useSession'
import { useScreenWidth } from '../Providers/MobileWrapper'


type Props = {
    channelId:string,
    toggler:React.Dispatch<React.SetStateAction<{
        status: boolean;
        _id: string;
    }>>
}

export default function CreateRoom({channelId,toggler}:Props) {
    const session = useSession()
    const dispatch = useDispatch()
    const router = useRouter()
    const [formattedRoomName,setFormattedRoomName] = useState('')
    const params = useParams()
    const isMobile = useScreenWidth()
    
    const handleRoomNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value;
        setFormattedRoomName(inputText.replace(/\s+/g, '-'));
      };
    
    
    async function handleCreateRoom(){
        if(formattedRoomName.length > 0){
            try {
                const chatIdResponse = await createRoom(params.serverId,channelId,formattedRoomName)
                const serverId = params.serverId
                const chatId = chatIdResponse.data
                router.push(`/servers/${session._id}/${serverId}/${chatId}`)
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
                <AiOutlineClose 
                    onClick={()=>toggler((prev)=>({...prev,status:false,_id:""}))}
                />
            </div>
            <div className='flex flex-col justify-end w-full'>
                <p className='text-2xl font-semibold'>Create room</p>
                <p className='opacity-50'>Room is where the chat is...</p>
            </div>
            
            <div className='w-full h-full flex flex-col items-start gap-2'>
                <div className='cursor-pointer pl-5 flex items-center justify-start w-full h-[50px] bg-[#282B30] rounded-md shadow-lg gap-2'>
                    <p className='text-xl'>#</p>
                    <input 
                        value={formattedRoomName} 
                        type='text' 
                        onChange={handleRoomNameInput} 
                        placeholder='Your-room-name'
                        className='no-underline w-full h-full bg-transparent outline-none text-xl'
                    />
                </div>
            </div>
            <div 
                onClick={handleCreateRoom} 
                className='cursor-pointer flex items-center justify-center w-[150px] h-[50px] bg-green-700 rounded-md'
                >
                <p>Create</p>
            </div>
        </motion.div>
    </div>
  )
}
