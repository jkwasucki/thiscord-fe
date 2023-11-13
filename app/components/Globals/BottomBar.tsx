'use client'
import useSession from '@/utils/useSession'
import ManageUser from '../Modals/ManageUser'
import UserBar from './UserBar'
import { audioRtcToggler, leaveRoomRtc, micRtcToggler } from '@/lib/agora'
import muteSound from '../../../public/sounds/mute.mp3'
import unmuteSound from  '../../../public/sounds/unmute.mp3'
import leaveRoomSound from '../../../public/sounds/leaveRoom.mp3'
import { playSound } from '@/functions/playSound'
import { useScreenWidth } from '../Providers/MobileWrapper'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { BiSolidMicrophone } from 'react-icons/bi'
import {MdHeadsetMic, MdHeadsetOff} from 'react-icons/md'
import {PiPhoneXFill} from 'react-icons/pi'
import socket from '@/lib/socket'
import { useParams } from 'next/navigation'
import { AiOutlineAudioMuted } from 'react-icons/ai'


export default function BottomBar() {
    const session = useSession()
  


    const [voiceState,setVoiceState] = useState<{_id:string,avatar:string,nickname:string,micMuted:boolean,fullyMuted:boolean} | undefined>()
    const params = useParams()

    // Mobile 
    const isMobile = useScreenWidth()
    const isOpenedChat = useSelector((state:RootState)=>state.mobileReducer.globals.chat)
    const isOpenedActivity = useSelector((state:RootState)=>state.mobileReducer.globals.activity)
    const isOpenedFriendsTab = useSelector((state:RootState)=>state.mobileReducer.friends.friendsTab)

    const [manageUser,setManageUser] = useState(false)

    function disconnectRoom(){
        playSound(leaveRoomSound,0.3) 
        leaveRoomRtc() // Unsubscribe from audio
        socket.emit('disconnectRoom',session._id)
        socket.emit('requestVoiceRooms',(params.serverId))
        socket.emit('requestUserVoiceState', session._id)
        
        
        if(params.serverId){
            socket.emit('requestVoiceRooms',(params.serverId))
        }
    }

    function fullyMuteUnmuteClient(){
 
        if (voiceState?.fullyMuted) {
            playSound(unmuteSound, 0.3);
        } else {
            playSound(muteSound, 0.3);
        }
    
        audioRtcToggler(voiceState?.micMuted!, !voiceState?.fullyMuted!);
    

        socket.emit('fullyMuteUnmuteClient',session._id)
        socket.emit('requestUserVoiceState',(session._id))
        if(params.serverId){
            socket.emit('requestVoiceRooms',(params.serverId))
        }
        ()=>{
            socket.disconnect()
        }
    }
    

    function muteUnmuteClient(){
        if(voiceState?.micMuted){
            playSound(unmuteSound,0.3) 
        }else{
            playSound(muteSound,0.3) 
        }

        micRtcToggler(!voiceState?.micMuted,voiceState?.fullyMuted);
        socket.emit('muteUnmuteClient',session._id)
        socket.emit('requestUserVoiceState',(session._id))
        if(params.serverId){
            socket.emit('requestVoiceRooms',(params.serverId))
        }
        ()=>{
            socket.disconnect()
        }
    }


    useEffect(() => {
        
        socket.emit('requestUserVoiceState', session._id);
        socket.on('requestedUserVoiceState', (voiceState) => {
            setVoiceState(voiceState);
        });
        ()=>{
            socket.disconnect()
        }
    }, []);
    console.log(voiceState)
    return isMobile  ?  (
        <div className={`${!isOpenedChat && !isOpenedActivity && !isOpenedFriendsTab ? 'fixed' : "hidden"} bottom-0 left-12  flex justify-between px-5 pr-[80px] items-center w-screen sm:w-[252px] text-white h-[60px] bg-[#1e2124] p-3 cursor-pointer opacity-100`}>
            <div 
                onClick={() => setManageUser(true)} 
                className='flex items-center justify-between gap-2 hover:bg-stone-700 py-1 pr-5 pl-1 rounded-lg'
            >
                <UserBar user={session}/>
            </div>
            <div className='flex items-center gap-1'>
                <div 
                    onClick={muteUnmuteClient} 
                    className='hover:bg-[#424549] rounded-md w-8 h-8 flex items-center justify-center'
                >
                    {voiceState?.micMuted ? 
                        <AiOutlineAudioMuted size={20} className='text-red-600'/> 
                        : 
                        <BiSolidMicrophone size={20}/>
                    }  
                </div>
                <div 
                    onClick={fullyMuteUnmuteClient} 
                    className='hover:bg-[#424549] rounded-md w-8 h-8 flex items-center justify-center'
                >
                    {voiceState?.fullyMuted ? 
                        <MdHeadsetOff size={20}/> 
                        : 
                        <MdHeadsetMic size={20}/>
                    }
                </div>
                <div 
                    onClick={disconnectRoom} 
                    className='hover:bg-[#424549] rounded-md w-8 h-8 flex items-center justify-center'
                >
                    <PiPhoneXFill size={20} />
                </div>
            </div>
            {manageUser && <ManageUser toggler={setManageUser}/>}
        </div>
    ):(
        <div className='flex justify-between px-5 items-center  sm:w-[300px]   text-white h-[60px] bg-[#1e2124] p-3 cursor-pointer opacity-100'>
            <div 
                onClick={() => setManageUser(true)} 
                className='flex items-center justify-between gap-2 hover:bg-stone-700 py-1 pr-5 pl-1 rounded-lg'
            >
                <UserBar user={session}/>
            </div>
            <div className='flex items-center gap-1'>
                <div 
                    onClick={muteUnmuteClient} 
                    className='hsover:bg-[#424549] rounded-md w-8 h-8 flex items-center justify-center'
                >
                    {voiceState?.micMuted ? 
                        <AiOutlineAudioMuted size={20} className='text-red-600'/> 
                        : 
                        <BiSolidMicrophone size={20}/>
                    }  
                </div>
                <div 
                    onClick={fullyMuteUnmuteClient} 
                    className='hover:bg-[#424549] rounded-md w-8 h-8 flex items-center justify-center'
                >
                    {voiceState?.fullyMuted ? 
                        <MdHeadsetOff size={20}/> 
                        : 
                        <MdHeadsetMic size={20}/>
                    }
                </div>
                <div 
                    onClick={disconnectRoom} 
                    className='hover:bg-[#424549] rounded-md w-8 h-8 flex items-center justify-center'
                >
                    <PiPhoneXFill size={20} />
                </div>
            </div>
            {manageUser && <ManageUser toggler={setManageUser}/>}
        </div>
    )
}
