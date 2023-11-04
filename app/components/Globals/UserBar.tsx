import React, { useEffect, useMemo, useState } from 'react'
import socket from '@/lib/socket';
import useSession from '@/utils/useSession';

type Props = {
    user:User | Friend | undefined,
}

export default function UserBar({user}:Props) {
    const session = useSession()
    
    const [status, setStatus] = useState<string>('')
  
    socket.emit('requestInitialUsersStatus')

    //User status management
    useEffect(() => {
        let isMounted = true;
    
        // When status changes, update 
        socket.on('updateUsersSocket', (data) => {
          if (data.userId === user?._id) {
            sessionStorage.setItem(`userStatus_${user?._id}`, data.status)
            setStatus(data.status);
          }
        });
    
        // Check if user status is in sessionStorage
        const storedStatus = sessionStorage.getItem(`userStatus_${user?._id}`)
    
        if (storedStatus !== null) {
          // Use stored status
          setStatus(storedStatus)
        } else {
          // Request initial user status
         
          socket.on('requestedInitialUsersStatus', (data) => {
            const userData = data.find((userData: { userId: string; status: string }) => userData.userId === user?._id)
            if (isMounted) {
              if (userData) {
                setStatus(userData.status)
    
                // Save to sessionStorage
                sessionStorage.setItem(`userStatus_${user?._id}`, userData.status)
              } else if (user?._id !== session._id && !userData) {
                // Set default status
                setStatus('offline')
    
                // Save to sessionStorage
                sessionStorage.setItem(`userStatus_${user?._id}`, 'offline')
              }
            }
          });
        }
    
        return () => {
          isMounted = false;
        };
      }, [user, session._id])

    return (
    <>
        <div className='group relative rounded-full bg-green-600 w-8 h-8 flex justify-center items-center'>
            <img 
                src={user?.avatar === 'default'? '/avatar.png' : user?.avatar} 
                className='w-full h-full object-cover rounded-full'
            />
            <div className={`
                ${status === 'active' && 'bg-green-600'} 
                ${status === 'offline' && 'bg-red-600'} 
                ${status === 'inactive' && 'bg-orange-300'} 
                absolute right-0 bottom-0 rounded-full w-3 h-3 border border-[#282b30]`}
            />
        </div>
        <div className='flex flex-col text-sm'>
            <p>{user?.nickname}</p>
            <p className='text-[11px]'>
                {status === 'active' && "Online"}
                {status === 'inactive' && "Away"}
                {status === 'offline' && "Offline"}
                {!status && 'Online'}
            </p>
        </div>
    </>
  )
}

