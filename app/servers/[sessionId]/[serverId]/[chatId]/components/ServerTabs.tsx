'use client'
import ChangeRoomName from '@/app/components/Modals/ChangeRoomName'
import CreateRoom from '@/app/components/Modals/CreateRoom'
import ManageServer from '@/app/components/Modals/ManageServer/ManageServer'
import TooltipLeft from '@/app/components/Tooltips/TooltipLeft'
import { useServerContext } from '@/app/components/Providers/ServerEventProvider'
import CreateChannel from '@/app/components/Modals/CreateChannel'
import SendServerInvite from '@/app/components/Modals/SendServerInvite'
import { useScreenWidth } from '@/app/components/Providers/MobileWrapper'
import socket from '@/lib/socket'
import useSession from '@/utils/useSession'
import { initRtc, initVolumeIndicator } from '@/lib/agora'
import Link from 'next/link'
import { setMobileState } from '@/redux/mobileSlice'
import React, { useEffect, useState } from 'react'
import { BsFillGearFill, BsPlus } from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import { AiOutlineAudioMuted, AiOutlinePlus, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { RiHomeGearFill } from 'react-icons/ri'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { GiSpeaker } from 'react-icons/gi'
import { MdHeadsetOff } from 'react-icons/md'
import { UID } from 'agora-rtc-sdk-ng'


type Props = {
    role?:{
        owner?:boolean,
        admin?:boolean,
        vip?:boolean;
    },
    serverData:Server | undefined,
    serverId:string
}

export default function ServerTabs({serverData,serverId,role}:Props) {
    const session = useSession()


    
    const isMobile = useScreenWidth();
    const isOpened = useSelector((state:RootState)=>state.mobileReducer.server.serversTab)
    
    const {channels,name,_id} = serverData as Server
    const { shouldRefetchServer } = useServerContext();
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch()

    const [initialDataReceived, setInitialDataReceived] = useState(false);
    const [createRoom,setCreateRoom] = useState({
        status:false,
        _id:''
    })


    const [voiceRooms, setVoiceRooms] = useState<Record<string, 
        { users: 
            { _id: string; avatar: string; nickname: string,micMuted:boolean,fullyMuted:boolean}[] }>>({});
    const [volumeLevel, setVolumeLevel] = useState<{ level: number; uid: UID } | undefined>(undefined);
    const [voiceState,setVoiceState] = useState<{_id:string,avatar:string,nickname:string,micMuted:boolean,fullyMuted:boolean} | undefined>(undefined)

    const [invite,setInvite] = useState(false)
    const [createChannel,setCreateChannel] = useState(false)
    const [manage,setManage] = useState(false)
    const [changeRoomName,setChangeRoomName] = useState({
        status:false,
        roomId:''
    })
    
    
    useEffect(()=>{
        router.refresh()
    },[shouldRefetchServer])
    
    
    async function handleJoinRoom(room:string,user:{_id:string,avatar:string,nickname:string}){
        initRtc(room, session._id!,serverId,voiceState?.micMuted,voiceState?.fullyMuted,user).then(()=>{
            initVolumeIndicator(setVolumeLevel)
            socket?.emit('joinVoiceRoom',user,room,serverId)
            socket?.emit('requestVoiceRooms',(serverId))
        })
    }

    // Upon render, request voice rooms for current server
    useEffect(()=>{
        
            socket.on('requestedVoiceRooms',(rooms)=>{
                setVoiceRooms(rooms)
            })
            socket.emit('requestVoiceRooms',(serverId))
    
            socket.emit('requestUserVoiceState', session._id);
            socket.on('requestedUserVoiceState', (voiceState) => {
                setVoiceState(voiceState);
            });
            ()=> socket.disconnect()
       
    },[])

   
    // Re-join voice channel (if) after page re-freash
    useEffect(()=>{
        let room
        let user
        
        if(!initialDataReceived && voiceState && voiceRooms){
            const userFound = Object.keys(voiceRooms).some(roomId =>
                voiceRooms[roomId]?.users.some(user => {
                    if (user._id === session._id) {
                        room = roomId
                        user = user
                        return true // user found, stop the loop
                    }
                    return false
                })
            );
        
            if (userFound) {
                setInitialDataReceived(true)
                initRtc(room!, session._id!, serverId, voiceState?.micMuted,voiceState?.fullyMuted, user!).then(() => {
                    initVolumeIndicator(setVolumeLevel)
                })
            }
        }
    },[initialDataReceived,voiceRooms,voiceState])

   return isMobile ? (
    <div className={`${isOpened ? 'flex flex-col w-[85vw] h-screen gap-12' : 'hidden'} relative flex overflow-hidden flex-col h-full bg-[#282b30] text-[#80848e] gap-5 `}>
        <div className='border-b border-[#1e2124] h-12 w-full flex items-center justify-center'>
            <div className='flex items-center justify-between'>
                <p className='truncate w-[200px] font-semibold text-white pl-2'>{name}</p>
                <div className=' cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <div className='relative group'>
                        {    
                                role?.owner &&
                                <RiHomeGearFill 
                                    onClick={()=>setManage(true)} 
                                    className='hover:text-white'
                                />
                            }
                            <TooltipLeft text='Manage server'/>
                        </div>
                        <div className='relative group'>
                            <AiOutlineUsergroupAdd
                                onClick={()=>setInvite(true)}
                                className='cursor-pointer hover:text-white'
                            />
                            <TooltipLeft text='Invite'/>
                        </div>
                    </div>
                    {invite && 
                        <SendServerInvite
                            toggler={setInvite}
                            userId={session._id!} 
                            serverId={serverId}
                            serverName={serverData!.name}
                        />
                    }
                    {manage &&
                        <ManageServer 
                            toggler={setManage}
                            serverData={serverData}
                        />
                    }
                </div>
            </div>
        </div>
        {   (role?.owner || role?.admin) &&
            <div className='flex items-center justify-center w-full h-5'>
                    <div 
                        onClick={()=>setCreateChannel(true)} 
                        className='hover:text-white cursor-pointer flex items-center justify-center w-full hover:bg-[#424549] h-8 gap-3'
                    >
                        <p>Create channel</p>
                        <AiOutlinePlus size={10}/>
                    </div>
            </div>
        }
        {createChannel &&
            <CreateChannel 
                serverId={_id} 
                toggler={setCreateChannel}
            />
        }
        {channels?.map((channel:Channel)=>{
            return (
                <div 
                    key={channel._id} 
                    className='flex flex-col rounded-lg py-2 px-3 '
                    >
                    <div className='flex justify-betweeen items-center'>
                        <p className='text-sm w-full h-max pb-3 hover:text-white cursor-pointer'>
                            {channel.title}
                        </p>
                        {
                            (role?.owner || role?.admin) &&
                            <div className='relative group'>
                                <BsPlus 
                                    onClick={()=>setCreateRoom((prev)=>({...prev,status:true,_id:channel._id}))} 
                                    size={25} 
                                    className='cursor-pointer hover:text-white'
                                />
                                <TooltipLeft text='Create room'/>
                            </div>
                        }
                        {
                            createRoom.status &&
                            createRoom._id === channel._id && (
                                <CreateRoom 
                                channelId={channel._id}
                                toggler={setCreateRoom}
                                />
                            )
                        }
                    </div>
                    {channel.rooms.map((room:Room)=>{
                        return(
                            <div key={room._id}  className='flex flex-col gap-2'>
                                <div 
                                className={`${isMobile && params.chatId === room._id ? 'bg-[#424549] text-white': "" } flex items-center justify-between  rounded-md px-2`}
                                >
                                    { channel.chanType === 'text' ? (
                                        
                                        <div className='flex items-center justify-between w-full hover:bg-[#424549] px-2 rounded-md'>
                                             <Link 
                                                onClick={() => {
                                                    setTimeout(() => {
                                                    dispatch(setMobileState({ component: 'chat', group: 'globals' }));
                                                    }, 500);
                                                }}
                                                href={`/servers/${session._id}/${serverId}/${room._id}`} 
                                                className='hover:text-white flex items-center justify-between  w-full'
                                            >
                                                <div className='flex justify-between items-center gap-3'>
                                                    <div className='flex  items-center gap-3'>
                                                        {channel.chanType === 'text' ? 
                                                            <p className='text-2xl'>#</p>
                                                            :
                                                            <GiSpeaker size={30}/>
                                                        }
                                                        <p>{room.name}</p>
                                                    </div> 
                                                </div>
                                            </Link>
                                            <div className='relative group '>
                                                {
                                                    (role?.owner || role?.admin) &&
                                                    <>
                                                        <BsFillGearFill
                                                            size={15}
                                                            onClick={()=>setChangeRoomName((prev)=>({...prev,status:true,roomId:room._id}))}
                                                        />
                                                        <TooltipLeft text='Edit'/>
                                                    </>
                                                }
                                                {
                                                    changeRoomName.roomId === room._id && 
                                                    changeRoomName.status &&  
                                                    <ChangeRoomName
                                                        channelId={channel._id}
                                                        serverId={_id}
                                                        roomId={room._id} 
                                                        toggler={() => setChangeRoomName({ status: false, roomId: '' })}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-between w-full'>
                                            <div className='cursor-pointer hover:bg-[#424549] w-full hover:text-slate-300 rounded-md px-2 flex justify-between items-center gap-3'>
                                                <div 
                                                    onClick={()=>handleJoinRoom(room._id, { _id: session._id!, nickname: session.nickname, avatar: session.avatar })} 
                                                    className=' w-full flex  items-center gap-3'>
                                                    {channel.chanType === 'text' ? 
                                                        <p className='text-2xl'>#</p>
                                                        :
                                                        <GiSpeaker size={30}/>
                                                    }
                                                    <p>{room.name}</p>
                                                </div> 
                                                <div className='relative group '>
                                                    {
                                                        (role?.owner || role?.admin) &&
                                                        <>
                                                            <BsFillGearFill
                                                                size={15}
                                                                onClick={()=>setChangeRoomName((prev)=>({...prev,status:true,roomId:room._id}))}
                                                            />
                                                            <TooltipLeft text='Edit'/>
                                                        </>
                                                    }
                                                    {
                                                        changeRoomName.roomId === room._id && 
                                                        changeRoomName.status &&  
                                                        <ChangeRoomName
                                                            channelId={channel._id}
                                                            serverId={_id}
                                                            roomId={room._id} 
                                                            toggler={() => setChangeRoomName({ status: false, roomId: '' })}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='flex flex-col pl-8'>
                                    {voiceRooms &&
                                     voiceRooms[room._id] && 
                                     voiceRooms![room._id]
                                     .users?.map((user:{_id:string,avatar:string,nickname:string,micMuted:boolean,fullyMuted:boolean})=>{
                                        return(
                                            <div
                                                key={user._id} 
                                                className='flex items-center justify-between gap-3 hover:bg-[#424549] hover:text-slate-300 px-2 rounded-md '
                                                >
                                                <div className='flex items-center gap-3'>
                                                    <div className={`rounded-full w-7 h-7 relative `}>
                                                        <img 
                                                            src={user?.avatar === 'default' ? '/avatar.png' : user?.avatar} 
                                                            className='absolute inset-0 w-7 h-7 object-cover rounded-full'
                                                            style={
                                                                volumeLevel && 
                                                                volumeLevel.uid === user._id && 
                                                                volumeLevel.level > 25 ? 
                                                                { border: '2px solid #00FF00', boxSizing: 'border-box' } : { boxSizing: 'border-box' }
                                                            }
                                                            alt="User Avatar"
                                                        />
                                                    </div>
                                                    <p>{user.nickname}</p>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    {user.micMuted && <AiOutlineAudioMuted/>}
                                                    {user.fullyMuted && <MdHeadsetOff/>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        })}
    </div>
    
  ) : (
    <div className='relative flex flex-col w-full sm:max-w-[300px] h-full bg-[#282b30] text-[#80848e] gap-5'>
        <div className='border-b border-[#1e2124] h-12 w-full flex items-center justify-center'>
            <div className='flex items-center justify-between'>
                <p className='truncate w-[200px] font-semibold text-white pl-2'>{name}</p>
                <div className=' cursor-pointer'>
                    <div className='flex items-center gap-2'>
                        <div className='relative group'>
                           {    
                                role?.owner &&
                                <RiHomeGearFill 
                                    onClick={()=>setManage(true)} 
                                    className='hover:text-white'
                                />
                            }
                            <TooltipLeft text='Manage server'/>
                        </div>
                        <div className='relative group'>
                            <AiOutlineUsergroupAdd
                                onClick={()=>setInvite(true)}
                                className='cursor-pointer hover:text-white'
                            />
                            <TooltipLeft text='Invite'/>
                        </div>
                    </div>
                    {invite && 
                        <SendServerInvite
                            toggler={setInvite}
                            userId={session._id!} 
                            serverId={serverId}
                            serverName={serverData!.name}
                        />
                    }
                    {manage &&
                        <ManageServer 
                            toggler={setManage}
                            serverData={serverData}
                        />
                    }
                </div>
            </div>
        </div>
        {   (role?.owner || role?.admin) &&
            <div className='flex items-center justify-center w-full h-5'>
                    <div 
                        onClick={()=>setCreateChannel(true)} 
                        className='hover:text-white cursor-pointer flex items-center justify-center w-full hover:bg-[#424549] h-8 gap-3'
                    >
                        <p>Create channel</p>
                        <AiOutlinePlus size={20}/>
                    </div>
            </div>
        }
        {createChannel &&
            <CreateChannel 
                serverId={_id} 
                toggler={setCreateChannel}
            />
        }
        {channels?.map((channel:Channel)=>{
            return (
                <div 
                    key={channel._id} 
                    className='flex flex-col rounded-lg py-2 px-3 '
                    >
                    <div className='flex justify-betweeen items-center'>
                        <p className='text-sm w-full h-max pb-3 hover:text-white cursor-pointer'>
                            {channel.title}
                        </p>
                        {
                            (role?.owner || role?.admin) &&
                            <div className='relative group'>
                                <BsPlus 
                                    onClick={()=>setCreateRoom((prev)=>({...prev,status:true,_id:channel._id}))} 
                                    size={25} 
                                    className='cursor-pointer w-max h-max hover:text-white'
                                />
                                <TooltipLeft text='Create room'/>
                            </div>
                        }
                        {
                            createRoom.status &&
                            createRoom._id === channel._id && (
                                <CreateRoom 
                                channelId={channel._id}
                                toggler={setCreateRoom}
                                />
                            )
                        }
                    </div>
                    {channel.rooms.map((room:Room)=>{
                        return(
                            <div key={room._id}  className='flex flex-col gap-2'>
                                <div 
                                
                                className={`${isMobile && params.chatId === room._id ? 'bg-[#424549] text-white': "" } flex items-center justify-between  rounded-md px-2`}
                                >
                                    { channel.chanType === 'text' ? (
                                        <Link 
                                        onClick={()=>dispatch(setMobileState({component:"chat",group:"globals"}))}
                                        href={`/servers/${session._id}/${serverId}/${room._id}`} 
                                        className='hover:bg-[#424549] hover:text-white flex items-center justify-between px-2 rounded-md w-full'
                                        >
                                            <div className='flex justify-between items-center gap-3'>
                                                <div className='flex  items-center gap-3'>
                                                    {channel.chanType === 'text' ? 
                                                        <p className='text-2xl'>#</p>
                                                        :
                                                        <GiSpeaker size={30}/>
                                                    }
                                                    <p>{room.name}</p>
                                                </div> 
                                                
                                            </div>
                                            <div className='relative group '>
                                                    {
                                                        (role?.owner || role?.admin) &&
                                                        <>
                                                            <BsFillGearFill
                                                                size={15}
                                                                onClick={()=>setChangeRoomName((prev)=>({...prev,status:true,roomId:room._id}))}
                                                            />
                                                            <TooltipLeft text='Edit'/>
                                                        </>
                                                    }
                                                    {
                                                        changeRoomName.roomId === room._id && 
                                                        changeRoomName.status &&  
                                                        <ChangeRoomName
                                                            channelId={channel._id}
                                                            serverId={_id}
                                                            roomId={room._id} 
                                                            toggler={() => setChangeRoomName({ status: false, roomId: '' })}
                                                        />
                                                    }
                                                </div>
                                        </Link>
                                    ) : (
                                        <div className='flex items-center justify-between w-full'>
                                            <div className='cursor-pointer hover:bg-[#424549] w-full hover:text-slate-300 rounded-md px-2 flex justify-between items-center gap-3'>
                                                <div onClick={()=>handleJoinRoom(room._id, { _id: session._id!, nickname: session.nickname, avatar: session.avatar })} className=' w-full flex  items-center gap-3'>
                                                    {channel.chanType === 'text' ? 
                                                        <p className='text-2xl'>#</p>
                                                        :
                                                        <GiSpeaker size={30}/>
                                                    }
                                                    <p>{room.name}</p>
                                                </div> 
                                                <div className='relative group '>
                                                    {
                                                        (role?.owner || role?.admin) &&
                                                        <>
                                                            <BsFillGearFill
                                                                size={15}
                                                                onClick={()=>setChangeRoomName((prev)=>({...prev,status:true,roomId:room._id}))}
                                                            />
                                                            <TooltipLeft text='Edit'/>
                                                        </>
                                                    }
                                                    {
                                                        changeRoomName.roomId === room._id && 
                                                        changeRoomName.status &&  
                                                        <ChangeRoomName
                                                            channelId={channel._id}
                                                            serverId={_id}
                                                            roomId={room._id} 
                                                            toggler={() => setChangeRoomName({ status: false, roomId: '' })}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='flex flex-col pl-8'>
                                    {voiceRooms &&
                                     voiceRooms[room._id] && 
                                     voiceRooms![room._id]
                                     .users?.map((user:{_id:string,avatar:string,nickname:string,micMuted:boolean,fullyMuted:boolean})=>{
                                        return(
                                            <div
                                                key={user._id} 
                                                className='my-2 flex items-center justify-between gap-3 hover:bg-[#424549] hover:text-slate-300 px-2 rounded-md '
                                                >
                                                <div className='flex items-center gap-3'>
                                                    <div className={`rounded-full w-7 h-7 relative `}>
                                                        <img 
                                                            src={user?.avatar === 'default' ? '/avatar.png' : user?.avatar} 
                                                            className='absolute inset-0 w-7 h-7 object-cover rounded-full'
                                                            style={
                                                                volumeLevel && 
                                                                volumeLevel.uid === user._id && 
                                                                volumeLevel.level > 25 ? 
                                                                { border: '2px solid #00FF00', boxSizing: 'border-box' } : { boxSizing: 'border-box' }
                                                            }
                                                            alt="User Avatar"
                                                        />
                                                    </div>
                                                    <p>{user.nickname}</p>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    {user.micMuted && <AiOutlineAudioMuted/>}
                                                    {user.fullyMuted && <MdHeadsetOff/>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        })}
    </div>
  )
}
