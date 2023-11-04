
import Chat from '@/app/components/Chat/Chat'
import { getAllFriends, getAllInvites, getChat, getOneFriend, getPrivates } from '@/functions/handlers'
import Convos from '../../../../../components/Convos'
import ActivityTab from '../../../../../components/ActivityTab'
import React from 'react'
import BottomBar from '@/app/components/Globals/BottomBar'

type Params = {
    params:{
        chatId:string,
        friendId:string,
        sessionId:string
    }
}

export default async function Main({params:{chatId,friendId,sessionId}}:Params) {
    
   
    const [chatsResponse, chatResponse , notificationsResponse, friendResponse, friendsResponse] = await Promise.all([
        getPrivates(sessionId),
        getChat(chatId),
        getAllInvites(sessionId),
        getOneFriend(friendId),
        getAllFriends(sessionId),
    ])

  return (
      <main className='flex w-screen h-screen'>
        <div className='flex flex-col'>
            <Convos 
                chats={chatsResponse.data}
            />
            <BottomBar/>
        </div>
         <Chat 
            chatData={chatResponse.data} 
            friend={friendResponse.data}
        />
        <ActivityTab
            users={friendsResponse.data}
            invites={notificationsResponse.data}
        />
      </main>
  )
}
