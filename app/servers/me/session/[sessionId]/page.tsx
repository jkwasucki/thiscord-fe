
import Convos from '../../components/Convos'
import FriendsTab from '../../components/FriendsTab'
import ActivityTab from '../../components/ActivityTab'
import { getAllFriends, getAllInvites, getPrivates } from '@/functions/handlers'
import React from 'react'
import BottomBar from '@/app/components/Globals/BottomBar'

type Params = {
    params:{
        sessionId:string
    }
}

export default async function Main({params:{sessionId}}:Params) {
  
    const [chatsResponse, friendsResponse, notificationsResponse] = await Promise.all([
        getPrivates(sessionId),
        getAllFriends(sessionId),
        getAllInvites(sessionId)
    ]);


  return (
    <main className='flex sm:w-full'>
        <div className='flex flex-col'>
            <Convos 
                chats={chatsResponse.data}
            />
            <BottomBar/>
        </div>
        <FriendsTab
            friends={friendsResponse.data}
        />
        <ActivityTab
            users={friendsResponse.data}
            invites={notificationsResponse.data}
        />
    </main>
  )
}


