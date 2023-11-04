import { createAlert } from '@/redux/alertSlice'
import { useServerContext } from '../../Providers/ServerEventProvider'
import { manageRoles, removeUsers } from '@/functions/handlers'
import { useScreenWidth } from '../../Providers/MobileWrapper'
import React, { useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { RiAdminFill } from 'react-icons/ri'
import { RiArrowDropDownLine, RiVipDiamondFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'

type Props = {
    serverData:Server | undefined
}
type List = {
    name:string,
    _id:string
}

export default function UsersTab({serverData}:Props) {
    const {shakeServer} = useServerContext()
    const isMobile = useScreenWidth()
    
    const dispatch = useDispatch()
    const [dropDown,setDropDown] = useState(false)
    const [roleSelected,setRoleSelected] = useState('')
    const [selectedUsers,setSelectedUsers] = useState<List[]>([])

    const { users, permissions, _id } = serverData as Server
    const filteredUsers = users.filter((user)=>user._id !== permissions.owner)

    const handleUserClick = (userName:string,_id:string) => {
        const userExists = selectedUsers.some((user) => user._id === _id);

        if(_id === permissions.owner) return 

        if (userExists) {
            // If user exists, remove from the list
            setSelectedUsers((prev) => prev.filter((user) => user._id !== _id));
          } else {
            // If user doesn't exist, add to the list
            setSelectedUsers((prev) => [...prev, { name: userName, _id }]);
          }
    };
    async function handleRole(role:string,action:string){
        try {
            const response = await manageRoles(role,selectedUsers,action,_id)
            shakeServer()
            setRoleSelected('')
            setSelectedUsers([])
            dispatch(createAlert({type:"info",text:response.data}))
        } catch (error:any) {
            dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }
    async function handleRemoveUsers(){
        try {
            const response = await removeUsers(_id,selectedUsers)
            setSelectedUsers([])
            shakeServer()
            dispatch(createAlert({type:'info',text:response.data}))
        } catch (error:any) {
           dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }

  return (
    <>
        <div className='sm:w-2/3 w-max sm:h-screen flex flex-col py-12 px-8 gap-5 sm:overflow-y-auto cursor-default'>
            <p className='text-2xl'>Users settings</p>
            <div className='flex flex-col gap-2'>
                <p>Choose user</p>
                <div className='relative flex items-center justify-between px-2 w-1/2 h-12 rounded-md bg-[#1e2124]'>
                    <p 
                        onClick={()=>setDropDown(!dropDown)}
                        className='w-full select-none h-full flex gap-3 items-center '
                    >
                        { selectedUsers.length > 0 ? selectedUsers?.map((u)=>{
                            return (
                                <p>{u.name},</p>
                            )
                        })
                        :
                        <p  onClick={()=>setDropDown(!dropDown)}>Select users</p>
                    }
                    </p>
                    <RiArrowDropDownLine size={30}/>
                    {dropDown && 
                        <div 
                            className={`${filteredUsers.length === 1 && 'block'} absolute top-11 left-0 max-h-[300px] overflow-y-auto w-full bg-[#282b30] z-30 border-[1.5px] border-black`}
                            >
                            {filteredUsers.map((user)=>{
                                return(
                                    <div
                                        key={user._id} 
                                        onClick={()=>handleUserClick(user.nickname,user._id!)} 
                                        className='select-none h-12 w-full flex justify-between items-center hover:bg-[#36393e] px-2'
                                    >
                                        <p>{user.nickname}</p>
                                        {selectedUsers
                                            .some((selectedUser) => selectedUser._id === user._id) && (
                                                <AiOutlineCheck />
                                            )
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
            <line className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-5'>
                    <div className='flex items-center gap-3'>
                        <p className='text-2xl'>Selected user(s):</p>
                       {selectedUsers.map((user)=>{
                        return (
                            <p>{user.name}</p>
                        )
                       })}
                    </div>
                    <line className='w-1/2 h-[2px] bg-[#282b30]'/>
                    <div className='flex flex-col gap-3'>
                        <header className='text-2xl'>Manage titles</header>
                        <div className='flex flex-col opacity-50'>
                            <p className={`${isMobile && 'max-w-[350px]'} text-sm opacity-50`}>Admin - User will be able to moderate chat activities of other users and manage server itself.</p>
                            <p className={`${isMobile && 'max-w-[350px]'} text-sm opacity-50`}>VIP - Appreciate the best participants with the VIP badge.</p>
                        </div>
                       
                        <div 
                            onClick={()=>setRoleSelected('admin')}
                            className={`${roleSelected === 'admin' && 'bg-[#424549]'} flex items-center gap-3 hover:bg-[#424549] w-max rounded-md px-2`}
                        >
                            <RiAdminFill className='text-white'/>
                            <p>Administrator</p>
                        </div>
                        <div 
                            onClick={()=>setRoleSelected('vip')}
                            className={`${roleSelected === 'vip' && 'bg-[#424549]'} flex items-center gap-3 hover:bg-[#424549] w-max rounded-md px-2`}
                        >
                            <RiVipDiamondFill className='text-green-700'/>
                            <p>VIP</p>
                        </div>
                        <div className='flex items-center gap-5'>
                            <div  
                                onClick={()=>handleRole(roleSelected,'grant')} 
                                className='flex justify-center items-center w-max px-2 rounded-md h-8 bg-[#282b30]'>
                                <p>Submit</p>
                            </div>
                            <div
                                onClick={()=>handleRole(roleSelected,'withdraw')}  
                                className='flex justify-center items-center w-max px-2 rounded-md h-8 bg-[#282b30]'>
                            <p>Withdraw</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <line className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <header className='text-2xl text-red-500'>Delete user(s)</header>
                <div className='flex flex-col'>
                    <p className='flex gap-2 text-sm opacity-50'>
                        WARNING: Deletion is irreversible.
                    </p>
                </div>
                <div
                    onClick={handleRemoveUsers}
                    className='flex justify-center items-center w-max px-2 rounded-md h-8 bg-[#282b30]'
                >
                    <p>Remove selected</p>
                </div>      
            </div>
            <line className='w-1/2 h-[2px] bg-[#282b30]'/>
        </div>
    </>
  )
}
