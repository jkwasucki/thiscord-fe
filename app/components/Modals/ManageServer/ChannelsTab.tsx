import ChangeRoomName from '../ChangeRoomName'
import { useServerContext } from '../../Providers/ServerEventProvider'
import RoomDelConfirm from './components/RoomDelConfirm'
import { changeChannelName, removeChannel } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import React, { useEffect, useState } from 'react'
import {RiArrowDropDownLine} from 'react-icons/ri'
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai'
import { useDispatch } from 'react-redux'

type Props = {
    serverData:Server | undefined
}

export default function ChannelsTab({serverData}:Props) {
    const { channels,_id } = serverData as Server
    const { shakeServer } = useServerContext();
    const dispatch = useDispatch()

    //Channel
    const [dropDown,setDropDown] = useState(false)
    const [selectedChannel,setSelectedChannel] = useState<Channel | undefined>(undefined)
    const [deletePhrase,setDeletePhrase] = useState('')
    const [badPhrase,setBadPhrase] = useState(false)
    const [newChannelName,setNewChannelName] = useState('')

    //Rooms
    const [editRoomName,setEditRoomName] = useState({
        status:false,
        roomId:""
    })
    const [deleteRoom,setDeleteRoom] = useState({
        status:false,
        roomId:""
    })
   

    async function handleNameChange(channelId:string){
        if(selectedChannel && newChannelName.length > 0){
            try {
                const response = await changeChannelName(_id,channelId,newChannelName)
                setNewChannelName('')
                dispatch(createAlert({type:'info',text:response.data}))
                setSelectedChannel(undefined)
                shakeServer()
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }
    }

    async function handleDeleteChannel(channelId:string){
        if(selectedChannel){
            if(deletePhrase === selectedChannel?.title){
                try {
                    await removeChannel(_id,channelId)
                    setDeletePhrase('')
                    setSelectedChannel(undefined)
                    shakeServer()
                } catch (error) {
                    dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
                }
            }else{
                setBadPhrase(true)
            }
        }
    }

    //Responsible for updating selectedChannel in state after changes in rooms
    useEffect(()=>{
        if(selectedChannel){
            const currentSelectedChannel = selectedChannel
            const backToRoot = channels.find((channel:Channel)=>channel._id === currentSelectedChannel!._id)
            setSelectedChannel(backToRoot)
        }
    },[serverData])

  return (
    <>
        <div className='sm:w-2/3 w-max sm:h-screen flex flex-col py-12 px-8 gap-5 sm:overflow-y-auto cursor-default'>
            <p className='text-2xl'>Channels settings</p>
            <div className='flex flex-col gap-2'>
                <p>Choose channel</p>
                <div className='relative flex items-center justify-between px-2 w-1/2 h-12 rounded-md bg-[#1e2124]'>
                    <p 
                        onClick={()=>setDropDown(!dropDown)} 
                        className='w-full'
                    >
                        {channels[0]?.title}
                    </p>
                    <RiArrowDropDownLine size={30}/>
                    {dropDown && 
                        <div className='absolute top-11 left-0 max-h-[300px] overflow-y-auto w-full bg-[#282b30] z-30 border-[1.5px] border-black'>
                            { channels.map((channel)=>{
                                return(
                                    <div 
                                        key={channel._id} 
                                        onClick={()=>{setSelectedChannel(channel); setDropDown(false)}} 
                                        className='h-12 w-full flex items-center hover:bg-[#36393e] px-2'
                                    >
                                        <p>{channel.title}</p>
                                    </div>          
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-5'>
                    <div className='flex items-center gap-3'>
                        <p className='text-2xl'>Selected channel:</p>
                        <p className='text-white'>{selectedChannel?.title}</p>
                    </div>
                    <div className='w-1/2 h-[2px] bg-[#282b30]'/>
                    <div className='flex flex-col gap-3'>
                        <p>Change channel name</p>
                        <div className='flex items-center px-2 h-8 w-[300px] bg-[#282b30] rounded-md'>
                            <input 
                                value={newChannelName} 
                                onChange={(e)=>setNewChannelName(e.target.value)} 
                                type='text' 
                                className='w-full h-full bg-transparent outline-none text-slate-300 px-2' 
                            />
                            <p 
                                onClick={()=>handleNameChange(selectedChannel?._id)}
                            >
                                Submit
                            </p>
                        </div>
                    </div>
                   
                </div>
            </div>
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <p className='text-2xl'>Rooms</p>
                <p className='text-sm opacity-50'>WARNING: Room deletion is equal to chat deletion</p>
                <div className='w-[300px] max-h-[200px] gap-2'>
                    {selectedChannel?.rooms.map((room:Room)=>{
                        return(
                            <div 
                                key={room._id} 
                                className='group flex justify-between items-center gap-3 hover:bg-[#424549] w-full rounded-md px-2'
                                >
                                <div className='flex items-center gap-3'>
                                    <p>#</p>
                                    <p>{room.name}</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <AiOutlineClose 
                                        onClick={()=>setDeleteRoom((prev)=>({...prev,status:true,roomId:room._id}))}
                                        className='cursor-pointer hover:text-red-500'
                                    />
                                    {deleteRoom.status && deleteRoom.roomId === room._id && 
                                        <RoomDelConfirm
                                            toggler={setDeleteRoom}
                                            serverId={_id}
                                            roomId={room._id}
                                            channelId={selectedChannel._id}
                                        />
                                    }
                                    <AiFillEdit 
                                        onClick={()=>setEditRoomName((prev)=>({...prev,status:true,roomId:room._id}))} 
                                        className='cursor-pointer'
                                    />
                                    {editRoomName.status && editRoomName.roomId === room._id && 
                                        <ChangeRoomName
                                            toggler={setEditRoomName}
                                            serverId={_id}
                                            roomId={room._id}
                                            channelId={selectedChannel._id}
                                        />
                                    }
                                </div>
                            </div>  
                        )
                    })}
                </div>
            </div>
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3'>
                    <header className='text-2xl text-red-500'>Delete channel</header>
                    {badPhrase && <p className='text-sm text-red-400'>Phrase must match</p>}
                </div>
                
                <div className='flex flex-col'>
                    <p className='flex gap-2 text-sm opacity-50'>
                        WARNING: Deletion is irreversible.
                    </p>
                    <div className='flex items-center gap-2'>
                        <p className='flex gap-2 text-sm opacity-50'> In order to do so, retype the phrase:</p>
                        <p className='text-white select-none text-sm'>{selectedChannel?.title}</p>
                    </div>
                </div>
                <div className='flex items-center px-2 h-8 w-[300px] bg-[#282b30] rounded-md'>
                    <input
                        value={deletePhrase}
                        onChange={(e)=>setDeletePhrase(e.target.value)} 
                        type='text' 
                        className='w-full h-full bg-transparent outline-none text-slate-300 px-2' 
                    />
                    <p 
                        onClick={()=>handleDeleteChannel(selectedChannel?._id)}
                    >
                        Submit
                    </p>
                </div>
            </div>
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
        </div>
    </>
  )
}
