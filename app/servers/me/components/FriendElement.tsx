'use client'
import TooltipLeft from '@/app/components/Tooltips/TooltipLeft'
import { refetchUser, removeFriends } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import { createSession } from '@/redux/userSlice'
import { setMobileState } from '@/redux/mobileSlice'
import { useServerContext } from '@/app/components/Providers/ServerEventProvider'
import useSession from '@/utils/useSession'
import Link from 'next/link'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import UserBar from '@/app/components/Globals/UserBar'

type Props = {
    friend:Friend 
}

export default function FriendElement({friend}:Props) {
    const session = useSession()
    const dispatch = useDispatch()
    const { shakeServer } = useServerContext()

    async function handleDeleteFriend(){
        try {
            await removeFriends(session._id!,friend._id)
            const user = await refetchUser(session._id!)
            dispatch(createSession(user.data))
            shakeServer()
        } catch (error:any) {
            dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }

    return (
    <>
        <div className='absolute top-0 w-[70%] left-0 right-0 mx-auto h-0.5 bg-white opacity-10'/>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
               <UserBar user={friend}/>
            </div>
            <div className='flex items-center gap-3'>
                <Link
                    onClick={()=>dispatch(setMobileState({component:"chat",group:"globals"}))} 
                    href={`/servers/me/session/chat/${session._id}/${friend._id}/${friend.chatId}`} 
                    className='flex justify-center items-center rounded-full bg-[#282b30] w-9 h-9'
                >
                    <BiMessageSquareDetail className='cursor-pointer '/>
                </Link>
                <div 
                    className='cursor-pointer relative group flex justify-center items-center rounded-full bg-[#282b30] w-9 h-9'
                    >
                    <AiOutlineClose
                        onClick={handleDeleteFriend}
                        className='cursor-pointer hover:text-red-500'/>
                    <TooltipLeft text='Remove friend'/>
                </div>
            </div>
        </div>       
    </>
    
  )
}
