'use client'
import { useServerContext } from '@/app/components/Providers/ServerEventProvider'
import { acceptFriendInvite, declineFriendInvite, joinServer, refetchUser, removeNotification } from '@/functions/handlers'
import { createSession } from '@/redux/userSlice'
import { createAlert } from '@/redux/alertSlice'
import useSession from '@/utils/useSession'
import { useScreenWidth } from '@/app/components/Providers/MobileWrapper'
import { setMobileState } from '@/redux/mobileSlice'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { RiAdminFill, RiVipCrown2Fill, RiVipDiamondFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { BiArrowToRight } from 'react-icons/bi'
import { RootState } from '@/redux/store'
import { useParams } from 'next/navigation'
import UserBar from '@/app/components/Globals/UserBar'
import socket from '@/lib/socket'


type Props = {
    permissions?:{
        owner:string,
        admins:[string],
        vips:[string]
    },
    invites?:Notifications[]
    users:User[] | Friend[],
    serverId?:string,
    serverData?:Server
}


export default function ActivityTab({invites,users,permissions,serverId,serverData}:Props) {
    const session = useSession()

    const isMobile = useScreenWidth()
    const isOpened = useSelector((root:RootState)=>root.mobileReducer.globals.activity)
    const prevTab = useSelector((root:RootState)=>root.mobileReducer.prevTab[0])

    const { shakeServer, shakeServerIcons } = useServerContext()

    const [status,setStatus] = useState<{online?:boolean,away?:boolean,offline?:boolean}>({online:true})
    const dispatch = useDispatch()   
    const params = useParams()

    const [activeUsers,setActiveUsers] = useState<{_id:string,status:string}[]>()
    const [userObjects,setUserObjects] = useState(users)

    //Initial users status
    useEffect(()=>{
        async function dso(){
            socket.connect()
            socket.on('connect',()=>{
              
                if(users as Friend[]){
                    socket.emit('requestInitialActiveFriends',(session.friends))
                    socket.on('requestedInitialActiveFriends',(friends)=>{
                        setActiveUsers(friends)
                    
                    })
                }else if(users as User[]){
                    socket.emit('requestInitialActiveUsers',(serverData!.users))
                    socket.on('requestedInitialActiveUsers',(users)=>{
                        setActiveUsers(users)
                    })
                }
            })
            return () => {
                socket.disconnect()
            }
        }
        dso()
        

    },[])

    //Sort users
    const compareUsers = (a: User | Friend, b: User | Friend) => {
        //Check if the _id is in activeUsers array
        const aIsActive = userObjects?.includes(a._id!);
        const bIsActive = userObjects?.includes(b._id!);

        //Sort alphabetically
        if (aIsActive && !bIsActive) {
        return -1; //a comes first if it's active
        } else if (!aIsActive && bIsActive) {
        return 1; //b comes first if it's active
        } else {
        //Both are active or inactive, sort alphabetically
        return a.nickname.localeCompare(b.nickname);
        }
    };

    const sortedUsers = users?.sort(compareUsers);


    async function handleAcceptInv(inviteObj:Notifications,type:string){
        try {
            if(type === 'friend-inv'){
                await acceptFriendInvite(session._id!,inviteObj.payload.triggeredById!,inviteObj._id).then(async()=>{
                    shakeServer()
                    const user = await refetchUser(session._id!)
                    dispatch(createSession(user.data))
                })
                
            }else if(type === 'server-inv'){
                await joinServer(inviteObj.payload.serverId!,session._id!)
                const user = await refetchUser(session._id!)
                dispatch(createSession(user.data))
                shakeServer()
                shakeServerIcons()
            }
        } catch (error) {
            dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
        }
    }

    async function handleDeclineInv(invite:Notifications){
        try {
            if(invite.type === 'friend-inv'){
                await declineFriendInvite(session._id!,invite._id)
                const user = await refetchUser(session._id!)
                dispatch(createSession(user.data))
                shakeServer()
            }else{
                await removeNotification(invite.payload.triggeredById!,session._id!,invite._id)
                const user = await refetchUser(session._id!)
                dispatch(createSession(user.data))
                shakeServer()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return isMobile ? (
        <div className={` 
            ${(isOpened) ? "flex w-screen px-12 h-screen" : "hidden"}
             bg-[#282b30] flex flex-col p-6 text-slate-300 text-sm gap-5 overflow-y-auto`
            }>
            <div className='flex w-[100%] flex-col sm:mx-auto sm:w-full sm:h-screen gap-4 sm:px-12'>
                <div className='flex items-center justify-between gap-4'>
                    <p>Active - {activeUsers?.length}</p>
                    {isMobile && 
                        <BiArrowToRight 
                            size={20} 
                            onClick={() => {
                                
                                dispatch(setMobileState({ group: prevTab.group, component: prevTab.component }))
                            }}
                        />
                    }
                </div>
                {/* {sortedUsers?.map((user)=>{
                    return(
                        <div
                            key={user._id}
                            className='flex gap-2 hover:bg-[#424549] rounded-md px-3 py-1'>
                            <UserBar user={user}/>
                            {
                                permissions && user._id === permissions.owner && (
                                    <RiVipCrown2Fill className='text-yellow-500'/>
                                )
                            }
                            {
                                permissions &&  permissions.vips.includes(user._id) && (
                                    <RiVipDiamondFill className='text-green-700'/>
                                )
                                {
                            }
                                permissions && permissions.admins.includes(user._id) && (
                                    <RiAdminFill className='text-white'/>
                                )
                            }
                        </div>
                    )
                })} */}
                <div className='flex flex-col gap-3 h-max'>
                {invites && <p>Invites - {invites?.length}</p>}
                    {invites?.map((invite:Notifications)=>{
                        return(
                            <div key={invite._id} className='cursor-pointer flex items-center justify-between w-full h-12 bg-[#282b30] rounded-md px-2'>
                                <p>{invite.text}</p>
                                <div className='flex items-center gap-2'>
                                    <AiOutlineCheck 
                                        onClick={()=>handleAcceptInv(
                                                invite,
                                                invite.type
                                        )} 
                                        className='hover:text-green-700 cursor-pointer'
                                    />
                                    <AiOutlineClose 
                                        onClick={()=>handleDeclineInv(invite)} 
                                        className='hover:text-red-700 cursor-pointer'
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    ) : (
        <div className='h-full w-[300px] bg-[#282b30] flex flex-col p-6 text-slate-300 text-sm gap-5 overflow-y-auto'>
            <div className='flex w-full flex-col h-screen gap-4'>
                <div className='flex items-center justify-between gap-4'>
                    <p>Active - {activeUsers?.length}</p>
                </div>
                {sortedUsers?.map((user)=>{
                    return(
                        <div
                            key={user._id}
                            className='flex gap-2 hover:bg-[#424549] rounded-md px-3 py-1'>
                            <UserBar user={user}/>
                            {
                                permissions && user._id === permissions.owner && (
                                    <RiVipCrown2Fill className='text-yellow-500'/>
                                )
                            }
                            {
                                permissions &&  permissions.vips.includes(user._id) && (
                                    <RiVipDiamondFill className='text-green-700'/>
                                )
                            }
                            {
                                permissions && permissions.admins.includes(user._id) && (
                                    <RiAdminFill className='text-white'/>
                                )
                            }
                        </div>
                    )
                })}
                <div className='flex flex-col gap-3 h-max'>
                {invites && <p>Invites - {invites?.length}</p>}
                    {invites?.map((invite:Notifications)=>{
                        return(
                            <div key={invite._id} className=' cursor-pointer flex items-center justify-between w-full h-12 bg-[#393e47] rounded-md px-2'>
                                <p>{invite.text}</p>
                                <div className='flex items-center gap-2'>
                                    <AiOutlineCheck 
                                        onClick={()=>handleAcceptInv(
                                                invite,
                                                invite.type
                                        )} 
                                        className='hover:text-green-700 cursor-pointer'
                                    />
                                    <AiOutlineClose 
                                        onClick={()=>handleDeclineInv(invite)} 
                                        className='hover:text-red-700 cursor-pointer'
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
