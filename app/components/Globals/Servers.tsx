'use client'
import { useServerContext } from '../Providers/ServerEventProvider'
import TooltipLeft from '../Tooltips/TooltipLeft'
import CreateChannelServer from '../Modals/CreateServer'
import BottomBar from './BottomBar'
import { getAllServers } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import useSession from '@/utils/useSession'
import React, { useEffect, useState } from 'react'
import {FiUser} from 'react-icons/fi'
import {AiOutlinePlus} from 'react-icons/ai'
import Link from 'next/link'
import { GrChannel } from 'react-icons/gr'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { clearMobileState } from '@/redux/mobileSlice'
import { useScreenWidth } from '../Providers/MobileWrapper'
import { RootState } from '@/redux/store'

export default function Servers() {
    const session = useSession()
    const dispatch = useDispatch()
    //Mobile
    const isMobile = useScreenWidth()
    const isOpenedChat = useSelector((state:RootState)=>state.mobileReducer.globals.chat)
    const isOpenedActivity = useSelector((state:RootState)=>state.mobileReducer.globals.activity)
    const isOpenedFriendsTab = useSelector((state:RootState)=>state.mobileReducer.friends.friendsTab)
    //-----
    const { shouldRefetchServers } = useServerContext();
    const params = useParams()

    const [createServer,setCreateServer] = useState(false)
    const [servers,setServers] = useState<Server[] | undefined>([])

    useEffect(()=>{
        async function fetchServers(){
            if(typeof(session?._id) === 'string'){
                try {
                    const servers = await getAllServers(session._id)
                    setServers(servers.data)
                } catch (error) {
                    dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
                }
            }
        }
        fetchServers()
    },[session?._id,shouldRefetchServers])

    return isMobile ? (
        <div className={`${!isOpenedChat && !isOpenedActivity && !isOpenedFriendsTab ? 'flex px-2 w-max':'hidden'} inset-1 gap-3 h-screen flex-col items-center z-40 py-3`}>
            <Link onClick={()=>dispatch(clearMobileState({}))} href={`/servers/me/session/${session._id}`} className='group relative rounded-full bg-green-600 w-10 h-10 flex justify-center items-center hover:rounded-xl'>
                <div className='group-hover:block transition-all duration-100 hidden fixed left-0 h-8 w-1 bg-white rounded-t-full rounded-b-full'/>
                <FiUser size={20}/>
                <TooltipLeft text='Private messages'/>
            </Link>
            <div className='w-1/2 border-t border-thin bg-white opacity-30'/>
            {servers!.map((server:Server)=>{
                return (
                    <Link
                        onClick={()=>dispatch(clearMobileState({}))}
                        key={server._id}
                        href={`/servers/${session._id}/${server._id}/${server.channels.length > 0 ? server.channels[0]?.rooms[0]._id : server._id}`} 
                        className='group relative rounded-full bg-green-600 w-10 h-10 flex justify-center items-center hover:rounded-xl'
                        >
                        <div className={`${params.serverId === server._id && 'opacity-100'} group-hover:opacity-100 transition-all duration-100 opacity-0 fixed left-0 h-8 w-1 bg-white rounded-t-full rounded-b-full`}/>
                        <TooltipLeft text={server.name}/>
                        {server.avatar === "" ? 
                            <GrChannel/> 
                            :
                            <img src={server.avatar} className='rounded-full w-full h-full object-cover hover:rounded-xl'/>
                        }
                    </Link>
                )
            })}
            <div 
                onClick={()=>setCreateServer(true)} 
                className='group cursor-pointer relative rounded-full bg-green-600 w-10 h-10 flex justify-center items-center hover:rounded-xl '
            >
                <AiOutlinePlus size={20}/>
                <TooltipLeft text='Create server'/>
            </div>
            {createServer && 
                <CreateChannelServer toggler={setCreateServer}/>
            }
        </div>
    ) : (
        <div className='sm:w-[50px] sm:min-w-[70px] sm:inset-0 inset-1 gap-3 relative h-screen flex flex-col items-center z-40 py-3'>
            <Link 
                href={`/servers/me/session/${session._id}`} 
                className='group relative rounded-full bg-green-600 w-10 h-10 flex justify-center items-center hover:rounded-xl'
                >
                <div className='group-hover:block transition-all duration-100 hidden fixed left-0 h-8 w-1 bg-white rounded-t-full rounded-b-full'/>
                <FiUser size={20}/>
                <TooltipLeft text='Private messages'/>
            </Link>
            
            <div className='w-1/2 border-t border-thin bg-white opacity-30'/>
            {servers!.map((server:Server)=>{
                return (
                    <Link
                        key={server._id}
                        href={`/servers/${session._id}/${server._id}/${server.channels.length > 0 ? server.channels[0]?.rooms[0]._id : server._id}`} 
                        className='group relative rounded-full bg-green-600 w-10 h-10 flex justify-center items-center hover:rounded-xl'
                        >
                        <div className={`${params.serverId === server._id && 'opacity-100'} group-hover:opacity-100 transition-all duration-100 opacity-0 fixed left-0 h-8 w-1 bg-white rounded-t-full rounded-b-full`}/>
                        <TooltipLeft text={server.name}/>
                        {server.avatar === "" ? 
                            <GrChannel className='w-max h-max'/> 
                            :
                            <img 
                                src={server.avatar} 
                                className='rounded-full w-full h-full object-cover hover:rounded-xl'
                            />
                        }
                    </Link>
                )
            })}
            <div 
                onClick={()=>setCreateServer(true)} 
                className='group cursor-pointer relative rounded-full bg-green-600 w-10 h-10 flex justify-center items-center hover:rounded-xl '
            >
                <AiOutlinePlus size={20}/>
                <TooltipLeft text='Create server'/>
            </div>
            {createServer && 
                <CreateChannelServer toggler={setCreateServer}/>
            }
        </div>
    )
    }
