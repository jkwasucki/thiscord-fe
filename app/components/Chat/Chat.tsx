'use client'
import Message from '@/app/components/Chat/Message'
import useSession from '@/utils/useSession'
import WelcomeMsgChannel from '@/app/components/Chat/WelcomeMsgChannel'
import WelcomeMsgPrivate from './WelcomeMsgPrivate'
import { sendMessage } from '@/functions/handlers'
import { useScreenWidth } from '../Providers/MobileWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { setMobileState } from '@/redux/mobileSlice'
import { AiFillPlusCircle } from 'react-icons/ai'
import { BiDockTop } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { FaUserFriends } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'
import socket from '@/lib/socket'

type Props = {
    chatData: Chat | undefined,
    role?:{
        owner?:boolean,
        admin?:boolean,
        vip?:boolean;
    },
    permissions?:{
        owner:string,
        admins:[string],
        vips:[string]
    },
    //For chatting with a friend - it distinguishes chat type
    friend?:Friend
}

export default function Chat({chatData,friend,permissions}:Props) {
    const session = useSession()
    const isOpened = useSelector((state:RootState)=>state.mobileReducer.globals.chat)
    const isMobile = useScreenWidth()
    
    let loading = !chatData && true
    
    const dispatch = useDispatch()
    const {messages,_id,name,type} = chatData as Chat
  

    const [messagesDynamicArray,setmessagesDynamicArray] = useState(messages)
    const [message,setMessage] = useState('')
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    async function handleSendMessage(e:React.KeyboardEvent<HTMLInputElement>){
        if(e.key === 'Enter'){
            if(message.length > 0){
                try {
                    const messageRes = await sendMessage(_id,session._id!,message)
                    //Emit the message to return it dynamically
                    socket.emit('chatMessage', messageRes.data)
                    setMessage('')
                } catch (error) {
                    console.log(error)
                }
            } 
        }
    }

    //Update messages dynamically
    useEffect(() => {
        socket.on('chatMessage', (incomingMessage) => {
            setmessagesDynamicArray((prev) => [...prev, incomingMessage])
     
        });
    
        return () => {
            socket.disconnect()
        };
    }, []); 

    if(loading){
        return (
            <div className='w-screen h-screen flex items-center justify-center bg-black'>
                <p className="text-white text-3xl">'Loading...'</p>
            </div>
        )
    }
    
    useEffect(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, [messagesDynamicArray]);


    return isMobile ?  (
        <div className={`${isOpened ? 'fixed bottom-0 flex flex-col w-[100vw]' : 'hidden'} mx-auto relative  text-white h-full bg-[#36393e] pt-5 overflow-y-auto sm:gap-5`}>
            <div className='absolute z-50 flex items-center px-5 border-b bg-[#36393e] border-[#1e2124] top-0 left-0 w-full h-12'>
               <div className='flex w-screen justify-between items-center'>
                    <div className='flex items-center justify-start gap-3 '>
                        <FaBarsStaggered 
                            onClick={()=> 
                                friend ? 
                                dispatch(setMobileState({ group: 'friends', component: 'convos' }))
                                :
                                dispatch(setMobileState({ group: 'server', component: 'serversTab' }))
                            }
                        />
                        <BiDockTop size={30} className='opacity-50 hover:text-red-500'/>
                        <p>{type === 'server' ? name : friend?.nickname}</p>
                    </div>
                    <FaUserFriends 
                        onClick={()=>dispatch(setMobileState({component:"activity",group:'globals'}))}
                    />
                </div>
            </div>
            <div ref={messagesContainerRef} className='flex flex-col overflow-y-auto mt-auto  px-5 pb-5'>
                {chatData?.type === 'server' ? (
                    <WelcomeMsgChannel channel={name} />
                    ) : (
                    <WelcomeMsgPrivate nickname={friend!.nickname} />
                )}
                {messagesDynamicArray?.map((msg: Message) => (
                    <Message key={msg._id} content={msg} permissions={permissions} />
                ))}
            </div>
            <div className='pb-[100px] px-12'>
                <div className='w-[70vw] h-11 rounded-lg bg-[#424549]'>
                    <div className='flex items-center h-full w-full px-5 gap-3'>
                        <AiFillPlusCircle size={30} className='cursor-pointer opacity-50' />
                        <input
                        value={message}
                        onKeyDown={handleSendMessage}
                        onChange={(e) => setMessage(e.target.value)}
                        type='text'
                        className='w-full h-1/2 bg-transparent outline-none no-underline'
                        />
                    </div>
                </div>
            </div>
        </div>
  ):(
    <div className='relative z-10 flex flex-col sm:w-3/4 sm:h-full text-white text-sm pt-12 bg-[#36393e] p-2'>
            <div className='absolute flex items-center px-5 border-b bg-[#36393e] border-[#1e2124] top-0 left-0 w-full h-12'>
               <div className='flex w-screen justify-between items-center'>
                    <div className='flex items-center justify-start gap-3 '>
                        <BiDockTop size={30} className='opacity-50'/>
                        <p>{type === 'server' ? name : friend?.nickname}</p>
                    </div>
                </div>
            </div>
            <div ref={messagesContainerRef} className='w-full h-full overflow-y-auto overflow-x-hidden'>
                <div  className='relative flex flex-col justify-end w-[100vw] h-max px-5 pb-5'>
                    {chatData?.type === 'server' ? 
                        <WelcomeMsgChannel channel={name}/>
                        :
                        <WelcomeMsgPrivate nickname={friend!.nickname}/>
                    }
                    {messagesDynamicArray?.map((msg:Message,index:number)=>{
                       
                        return (
                            <Message 
                                key={msg._id} 
                                content={msg}
                                permissions={permissions}
                            />
                        )
                    })}
                </div>
            </div>
            <div className='flex items-end mb-3 justify-center w-full  h-11  relative'>
                <div className='absolute sm:w-[90%] w-[95%] h-11 rounded-lg bg-[#424549]'>
                    <div className='flex items-center h-full w-full px-5 gap-3'>
                        <AiFillPlusCircle size={30} className='cursor-pointer opacity-50'/>
                        <input 
                            value={message}
                            onKeyDown={handleSendMessage} 
                            onChange={(e)=>setMessage(e.target.value)} 
                            type='text' 
                            className='w-full h-1/2 bg-transparent outline-none no-underline'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}