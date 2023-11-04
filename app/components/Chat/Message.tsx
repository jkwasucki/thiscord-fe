import { findUser } from '@/functions/handlers'
import React, { useMemo, useState } from 'react'
import { AiTwotoneCrown } from 'react-icons/ai'
import { RiAdminFill, RiVipDiamondFill } from 'react-icons/ri'

type Props = {
    content:Message,
    permissions?:{
        owner:string,
        admins:[string],
        vips:[string]
    },
}

export default function Message({content,permissions}:Props) {
    const [user,setUser] = useState<{ avatar: string; _id: string; nickname: string }>()
    const { text, timestamp, type } = content;
    
   
    //Caching user dynamic data that might change later, like avatar or nickname
    useMemo(
        async () => {
          try {
            // Check if the user is already cached
            const cachedUserData = localStorage.getItem(`cachedUser_${content.sender}`);
    
            if (cachedUserData) {
              const { data, timestamp } = JSON.parse(cachedUserData);
    
              // Check if the cache is older than 3 minutes
              const cacheExpirationTime = 3 * 60 * 1000; // 3 minutes in milliseconds
              const isCacheExpired = new Date().getTime() - new Date(timestamp).getTime() > cacheExpirationTime;
    
              if (!isCacheExpired) {
                setUser(data);
                return;
              }
            }
    
            // If the cache is expired or not present, fetch user data
            const userData = await findUser(content.sender);
            const { avatar, _id, nickname } = userData;
    
            // Set the user data
            setUser({ avatar, _id, nickname });
    
            // Cache the user data in local storage
            const newCacheData = { data: { avatar, _id, nickname }, timestamp: new Date() };
            localStorage.setItem(`cachedUser_${content.sender}`, JSON.stringify(newCacheData));
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        },
        [content.sender]
      );
    
      

    return (
    <div className={`${type === 'individual' && 'pt-3'} group relative h-max w-full rounded-lg text-slate-300`}>
        <div className={`${type === 'appended' && 'group-hover:block'} hidden absolute left-0'`}>
            <p className='opacity-50 text-[10px]'>
              {timestamp.split(',').pop()}
            </p>
        </div>
        <div className='flex flex-col hover:bg-[#424549] rounded-md px-2 pt-1'>
            <div className='flex gap-3'>
                <div className='group relative rounded-full justify-start h-full flex flex-col'>
                   {type === 'individual' &&
                        <img 
                            src={user?.avatar === 'default' ? '/avatar.png' : user?.avatar} 
                            className='w-8 h-8 rounded-full object-cover'
                        />
                    }
                </div>
                <div className='flex flex-col'>
                    <div className='flex flex-col '>
                        {type === 'individual' && 
                            <div className='flex gap-3'>
                                <p className='font-semibold'>{user?.nickname}</p>
                                <p className='text-[10px] opacity-50'>{timestamp}</p>
                                {permissions && permissions.owner === user?._id &&
                                    <AiTwotoneCrown className='text-yellow-500'/>
                                }
                                {permissions && permissions.vips.includes(user?._id!) &&
                                    <RiVipDiamondFill className='text-green-700'/>
                                }
                                {permissions && permissions.admins.includes(user?._id!) &&
                                     <RiAdminFill className='text-white'/>
                                }
                            </div>
                        }
                        <div className={`flex flex-col ${type === 'appended' && 'ml-8'} `}>
                            {text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
