import { useServerContext } from '@/app/components/Providers/ServerEventProvider';
import { removeRoom } from '@/functions/handlers';
import { createAlert } from '@/redux/alertSlice';
import { motion } from 'framer-motion';
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useDispatch } from 'react-redux';

type Props = {
  toggler:React.Dispatch<React.SetStateAction<{
      status: boolean;
      roomId: string;
  }>>,
  serverId:string,
  channelId:string,
  roomId:string
}

export default function RoomDelConfirm({toggler,serverId,channelId,roomId}:Props) {
    const { shakeServer } = useServerContext()
    const dispatch = useDispatch()
    async function handleDeleteRoom(){
        try {
            await removeRoom(serverId,channelId,roomId)
            shakeServer()
            toggler((prev)=>({...prev,status:false,roomId:""}))
        } catch (error) {
            dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
        }
    }

  return (
    <div className='bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-40'>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.2, ease: "easeOut" }} 
            className='relative flex flex-col items-center w-[400px] bg-[#36393e] rounded-lg gap-5 p-5 text-slate-300 shadow-xl'
            >
            <div className='absolute right-0 top-0 p-3 cursor-pointer'>
                <AiOutlineClose 
                    onClick={()=>toggler((prev)=>({...prev,status:false,roomId:""}))}
                />
            </div>
            <div className='flex flex-col items-center justify-center w-full'>
                <p className='text-2xl font-semibold'>Are you sure?</p>
                <p className='opacity-50 text-red-300'>This deletion is irreversible!</p>
            </div>
            <div 
                onClick={handleDeleteRoom} 
                className='cursor-pointer flex items-center justify-center rounded-md w-[100px] border-black border shadow-xl h-12 bg-red-800'
            >
                <p className='text-white font-bold'>Delete</p>
            </div>
        </motion.div>
    </div>
  )
}
