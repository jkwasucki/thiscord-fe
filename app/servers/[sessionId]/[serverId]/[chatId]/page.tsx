
import BottomBar from '@/app/components/Globals/BottomBar'
import Chat from '../../../../components/Chat/Chat'
import ActivityTab from '../../../me/components/ActivityTab'
import ServerTabs from './components/ServerTabs'
import NoChatFound from '@/app/components/Chat/NoChatFound'
import axios from 'axios'
import API_BASE_URL from '@/config'


type Params = {
  params:{
    serverId:string,
    chatId?:string,
    sessionId:string
  }
}

export default async function Main({params:{serverId,chatId,sessionId}}:Params) {
   
    const roleData = await axios.get(`${API_BASE_URL}/api/servers/server/checkrole/${serverId}/${sessionId}`)
    const serverData = await axios.get(`${API_BASE_URL}/api/servers/server/getServer?id=${serverId}`)
    const chatData =  await axios.get(`${API_BASE_URL}/api/chats/chat/getChat/${chatId}`)
  
  return (
        <div className=' flex w-screen'>
            <div className='flex flex-col'>
                <ServerTabs
                    role={roleData.data}
                    serverData={serverData.data} 
                    serverId={serverId}
                />
                <BottomBar/>
            </div>
            {chatData.data ?
                <Chat
                    role={roleData.data}
                    chatData={chatData.data}
                    permissions={serverData.data.permissions}
                /> 
                :
                <NoChatFound/>
            }
            <ActivityTab
                serverData={serverData.data}
                serverId={serverData.data._id}
                permissions={serverData.data.permissions}
                users={serverData.data.users}
            />
        </div>
    )
}
