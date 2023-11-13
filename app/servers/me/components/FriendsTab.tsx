'use client'
import useSession from '@/utils/useSession'
import FriendElement from './FriendElement'
import { findFriend } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import { useServerContext } from '@/app/components/Providers/ServerEventProvider'
import { useScreenWidth } from '@/app/components/Providers/MobileWrapper'
import { setMobileState } from '@/redux/mobileSlice'
import React, { useEffect, useRef, useState } from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { FaUserFriends } from 'react-icons/fa'
import {FaBarsStaggered} from 'react-icons/fa6'
import { useRouter } from 'next/navigation'


type Props = {
    friends:Friend[]
}

export default function FriendsTab({friends}:Props) {
    const {shouldRefetchServer} = useServerContext()
    const isMobile = useScreenWidth()
    const isOpened = useSelector((root:RootState)=>root.mobileReducer.friends.friendsTab)

    const dispatch = useDispatch()
    const session = useSession()
    const router = useRouter()
    
    

    const [friendSearchInput,setFriendSearchInput] = useState('')

    const [foundFriends,setFoundFriends] = useState<Friend[]>([])

    async function handleSearchFriends(){
        if(friendSearchInput.length > 0){
            try {
                const friends = await findFriend(session._id!,friendSearchInput)
                setFoundFriends(friends.data)
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }
    }

    useEffect(()=>{
        router.refresh()
    },[shouldRefetchServer])
    
    const outsideClickRef =  useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        const handleOutSideClick = (event:MouseEvent) => {
            if (
                !outsideClickRef.current?.contains(event.target as Node) 
                && !outsideClickRef.current?.contains(event.target as Node)
                ) {
                setFoundFriends(null!)
                setFriendSearchInput('')
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    },[outsideClickRef])

    return isMobile ? (
        <div className={`${isOpened ? 'flex flex-col w-[100vw]' : 'hidden'} mx-auto relative  text-white h-full bg-[#36393e] pt-5 overflow-y-auto sm:gap-5`}>
        <div className='flex w-[100%] px-8 flex-col gap-4'>
            <div className='flex w-full justify-between'>
                <FaBarsStaggered
                    onClick={()=>dispatch(setMobileState({component:"convos",group:'friends'}))} 

                />
                <FaUserFriends 
                    onClick={()=>dispatch(setMobileState({component:"activity",group:'globals'}))} 
                />
            </div>
            <div ref={outsideClickRef} className='relative flex items-center  sm:w-full sm:h-12 h-[50px] bg-[#1e2124] rounded-lg gap-3 pr-2'>
                <input 
                    value={friendSearchInput}
                    onChange={(e)=>setFriendSearchInput(e.target.value)}
                    type='text' 
                    placeholder='Search' 
                    className='underline-none text-white pl-3  w-full rounded-lg outline-none bg-transparent'
                />
                <BiSearchAlt2 
                    onClick={handleSearchFriends} 
                    size={20} 
                    className='text-white cursor-pointer'
                />
                <div className='absolute top-[45px] bg-[#282b30] mah-h-[300px] border border-[#1e2124] w-full'>
                    {foundFriends?.map((friend:Friend)=>{
                        return(
                            <Link 
                                href={`/servers/me/session/chat/${session._id}/${friend._id}/${friend.chatId}`} 
                                key={friend._id} 
                                className='cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-[#424549]'
                                >
                                <div className='w-8 h-8 bg-red-500 rounded-full'>
                                    <img 
                                        src={friend.avatar === 'default' ? '/avatar.png' : friend.avatar} 
                                        className='w-full h-full object-cover rounded-full '
                                    />
                                </div>
                                <p>{friend.nickname}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <p>Friends - {friends?.length}</p>
            <div className='flex flex-col'>
                {friends && friends?.map((friend:Friend)=>{
                    return(
                        <div
                            key={friend._id}
                            className='relative py-5 hover:bg-[#424549] rounded-lg w-full w-[90%] px-2'
                            >
                            <FriendElement
                                key={friend._id}   
                                friend={friend}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  ):(
    <div className=' flex flex-col  w-full  text-white text-sm bg-[#36393e] pt-5'>
        <div className='flex sm:w-[1300px] flex-col sm:mx-auto sm:w-full sm:h-screen gap-4 sm:px-12'>
            <div ref={outsideClickRef} className='relative flex items-center  sm:w-full sm:h-12 h-[50px] bg-[#1e2124] rounded-lg gap-3 pr-2'>
                <input 
                    value={friendSearchInput}
                    onChange={(e)=>setFriendSearchInput(e.target.value)}
                    type='text' 
                    placeholder='Search' 
                    className='underline-none text-white pl-3  w-full rounded-lg outline-none bg-transparent'
                />
                <BiSearchAlt2 
                    onClick={handleSearchFriends} 
                    size={20} 
                    className='text-white cursor-pointer'
                />
                <div className='absolute top-[45px] bg-[#282b30] mah-h-[300px] border border-[#1e2124] w-full'>
                    {foundFriends?.map((friend:Friend)=>{
                        return(
                            <Link 
                                href={`/servers/me/session/chat/${session._id}/${friend._id}/${friend.chatId}`} 
                                key={friend._id} 
                                className='cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-[#424549]'
                                >
                                <div className='w-8 h-8 bg-red-500 rounded-full'>
                                    <img 
                                        src={friend.avatar === 'default' ? '/avatar.png' : friend.avatar} 
                                        className='w-full h-full object-cover rounded-full '
                                    />
                                </div>
                                <p>{friend.nickname}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <p>Friends - {friends?.length}</p>
            <div className='flex flex-col'>
                {friends && friends?.map((friend:Friend)=>{
                    return(
                        <div
                            key={friend._id}
                            className='relative py-5 hover:bg-[#424549] rounded-lg w-full w-[90%] px-2'
                            >
                            <FriendElement
                                key={friend._id}   
                                friend={friend}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}


