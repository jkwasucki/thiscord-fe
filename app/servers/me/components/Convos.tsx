'use client'
import { createAlert } from '@/redux/alertSlice'
import { inviteToFriends, searchUsers } from '@/functions/handlers'
import useSession from '@/utils/useSession'
import React, { useState,useRef, useEffect } from 'react'
import {FaUserFriends} from 'react-icons/fa'
import { AiOutlinePlus } from 'react-icons/ai'
import {BiSearchAlt2} from 'react-icons/bi'
import Link from 'next/link'
import { FcCheckmark } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { setMobileState } from '@/redux/mobileSlice'
import { useScreenWidth } from '@/app/components/Providers/MobileWrapper'
import BottomBar from '@/app/components/Globals/BottomBar'

type Props = {
    chats:Friend[]
}


export default function Convos({chats}:Props) {
    const isOpened = useSelector((state:RootState)=>state.mobileReducer.friends.convos)
    const isMobile = useScreenWidth()

    const session = useSession()

    const dispatch = useDispatch()
    const [nickname,setNickname] = useState('')
    const [foundUsers,setFoundUsers] = useState<[] | undefined>(undefined)
    
    const [invited,setInvited] = useState({
        list:[""]
    })
    const outsideClickRef =  useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        const handleOutSideClick = (event:MouseEvent) => {
            if (
                !outsideClickRef.current?.contains(event.target as Node) 
                && !outsideClickRef.current?.contains(event.target as Node)
                ) {
                setFoundUsers(null!)
                setNickname('')
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    },[outsideClickRef])

    async function handleSearchUser(){
        if(nickname.length > 0){
            try {
                const users = await searchUsers(nickname)
                setFoundUsers(users.data)
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }   
        }
    }

    async function handleInvite(friendId:string){
        try {
            await inviteToFriends(session._id!,friendId)
            setInvited((prev) => ({ ...prev, list: [...prev.list, friendId] }));
        } catch (error:any) {
           dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }


    return (
    <div className={`${isOpened ? 'flex flex-col w-[90vw] gap-12' : 'hidden'} border border-[#1e2124] sm:w-[300px] mx-auto gap-12 relative sm:flex sm:flex-col text-[#80848e] h-full bg-[#282b30] pt-5 overflow-y-auto sm:gap-5`}>
        <div className='relative flex gap-4 flex-col '>
            <Link 
                onClick={()=> isMobile && dispatch(setMobileState({component:"friendsTab",group:'friends'}))} 
                href={`/servers/me/session/${session._id}`} 
                className=' flex items-center gap-3 py-2 px-4 text-white w-full h-max hover:bg-stone-700 cursor-pointer'
            >
                <FaUserFriends/>
                <p>Friends</p>
            </Link>
            <div className='w-full h-[2px] bg-[#1e2124]'/>
            <div
                ref={outsideClickRef}
                className='pl-5 flex flex-col w-full h-[100px] rounded-tl-md rounded-tr-md'
                >
                <div className=' flex items-center w-full h-9'>
                    <p className='text-md text-white'>Invite friends</p>
                </div>  
                <div className='relative w-full h-full flex items-center'>
                    <div className='flex w-[85%] items-center rounded-md sm:h-8 h-12 bg-[#36393e]'>
                        <input 
                            value={nickname}
                            type='text' 
                            onChange={(e)=>setNickname(e.target.value)} 
                            className='w-full h-full bg-transparent outline-none no-underline px-2 text-white'
                        />
                        <BiSearchAlt2 
                            onClick={handleSearchUser} 
                            size={20} 
                            className='hover:text-white cursor-pointer'
                        />
                    </div>
                    <div className={`${!foundUsers && 'hidden' } border border-black absolute left-0 top-[50px] w-[85%]  max-h-[400px] h-max  bg-[#36393e] z-30`}>
                        <div className='flex flex-col'>
                            {foundUsers && foundUsers.map((user:User)=>{
                                return(
                                    <div className='hover:bg-[#424549] text-white flex justify-between items-center py-3 px-1 gap-3 '>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-8 h-8 rounded-full'>
                                                <Image 
                                                    priority={true} 
                                                    width={300} 
                                                    height={300} 
                                                    alt='avatar'
                                                    src={user.avatar === 'default'? '/avatar.png' : user.avatar} 
                                                    className='w-full h-full object-cover rounded-full '
                                                />
                                            </div>
                                            <p>{user.nickname}</p>
                                        </div>
                                        {invited.list.includes(user._id!) ? 
                                            <FcCheckmark/>
                                            :
                                            <AiOutlinePlus 
                                                onClick={()=>handleInvite(user._id!)} 
                                                className='cursor-pointer'
                                            />
                                        } 
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col rounded-lg py-2 px-2'>
                <p className='text-sm w-full h-max pb-3 hover:text-white'>Private chats</p>
                {chats.map((chat:Friend)=>{
                    return(
                        <Link key={chat._id} href={`/servers/me/session/chat/${session._id}/${chat._id}/${chat.chatId}`} className='group flex items-center gap-3 hover:bg-stone-700 hover:text-white rounded-lg py-1 px-3'>
                            <div className='flex items-center w-full justify-between'>
                                <div className='flex items-center gap-3 cursor-pointer'>
                                    <img 
                                        src={chat.avatar === 'default' ? '/avatar.png' : chat.avatar} 
                                        className='object-cover rounded-full w-[35px] h-[35px]'
                                    />
                                    <p className='text-sm'>{chat.nickname}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    </div>
  )
}
