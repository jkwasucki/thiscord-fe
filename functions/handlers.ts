import API_BASE_URL from "@/config";
import axios from "axios";

type Credentials = {
    email: string;
    password: string;
};

type ChangePasswordParams = {
    userId: string;
    newPassword: string;
};


type List = {
    name:string,
    _id:string
}

//User - authentication
export async function register(credentials:Credentials){
    return axios.post(`${API_BASE_URL}/api/user/register`, credentials);
}

export async function login(credentials:Credentials){
    return axios.post(`${API_BASE_URL}/api/user/login`,credentials,  { withCredentials: true })
}

export async function refetchUser(userId:string){
    return await axios.get(`${API_BASE_URL}/api/user/refetch/${userId}`)
}

export async function sendEmail(email:string){
   return axios.post(`${API_BASE_URL}/api/user/password/reset`,{email: email})
}

export async function changePassword({userId,newPassword}:ChangePasswordParams){
    return axios.post(`${API_BASE_URL}/api/user/password/change-password/${userId}`, newPassword)
}

export async function verifyToken(token:string){
    return axios.get(`${API_BASE_URL}/api/user/resetpass/verifyToken?tkn=${token}`)
}

//User to User

export async function acceptFriendInvite(userId:string | undefined,triggeredBy:string,inviteId:string){
    return axios.post(`${API_BASE_URL}/api/user/invite/accept/${userId}/${triggeredBy}/${inviteId}`)
}

export async function declineFriendInvite(userId:string,inviteId:string){
    return axios.post(`${API_BASE_URL}/api/user/invite/decline/${userId}/${inviteId}`)
}

export async function joinServer(serverId:string,userId:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/join/${serverId}/${userId}`)
}

export async function removeNotification(triggeredBy:string,userId:string,inviteId:string){
    return axios.delete(`${API_BASE_URL}/api/user/notification/delete/${triggeredBy}/${userId}/${inviteId}`)
}

export async function inviteToFriends(userId:string,friendId:string){
    return axios.post(`${API_BASE_URL}/api/user/invite/${userId}/${friendId}`)
}

export async function sendMessage(chatId:string,sessionId:string,message:string){
    return axios.post(`${API_BASE_URL}/api/chats/chat/message/send/${chatId}/${sessionId}`,{
        message:message
    })
}

export async function getPrivates(userId:string){
    return axios.get(`${API_BASE_URL}/api/chats/chat/getprivate/${userId}`)
}


//Searches
export async function searchUsers(nickname:string){
    return axios.get(`${API_BASE_URL}/api/user/search/${nickname}`)
}

export async function findUser(userId:string){
    const response = await fetch(`${API_BASE_URL}/api/user/find/${userId}`, {
        method: "GET",
        next:{revalidate:10},
        headers: {
          "Content-Type": "application/json",
        },
      });
    
     
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
    
      return data;
}


export async function findFriend(userId:string,search:string){
    return axios.get(`${API_BASE_URL}/api/user/find/friend/${userId}/${search}`)
}

export async function getOneFriend(friendId:string){
    return axios.get(`${API_BASE_URL}/api/user/friends/getOne/${friendId}`)
}


//Server actions

export async function inviteToServer(serverId:string,userId:string,friendId:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/invite/${serverId}/${userId}/${friendId}`)
}

export async function changeAvatar(serverId:string,imgUrl:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/changeavatar/${serverId}`,{
        avatar:imgUrl
    })
}

export async function serverNameChange(serverId:string,newName:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/changename/${serverId}`,{
        newName:newName
    })
}

export async function deleteServer(serverId:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/delete/${serverId}`)
}

export async function manageServerPrivacy(serverId:string,type:boolean){
    return axios.post(`${API_BASE_URL}/api/servers/server/changeprivacy/${serverId}`,{
        boolean:type
    })  
}

export async function manageRoles(role:string,selectedUsers:List[],action:string,serverId:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/manageRole/${serverId}`,{
        role:role,
        selectedUsers:selectedUsers,
        action:action
    })
}

export async function removeUsers(serverId:string,selectedUsers:List[]){
    return axios.post(`${API_BASE_URL}/api/servers/server/removeusers/${serverId}`,{
        selectedUsers:selectedUsers
    })
}

export async function removeRoom(serverId:string,channelId:string,roomId:string){
    return axios.post(`${API_BASE_URL}/api/rooms/room/delete/${serverId}/${channelId}/${roomId}`)
}

export async function changeChannelName(serverId:string,channelId:string,newChannelName:string){
    return await axios.post(`${API_BASE_URL}/api/servers/server/channel/changename/${serverId}/${channelId}`,{
        newName:newChannelName
    })
}

export async function removeChannel(serverId:string,channelId:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/channel/delete/${serverId}/${channelId}`)
}

export async function changeRoomName(serverId:string,channelId:string,roomId:string,newName:string){
    return axios.post(`${API_BASE_URL}/api/rooms/room/changename/${serverId}/${channelId}/${roomId}`,{
        newName:newName
    })
}

export async function createChannel(type:string,serverId:string,channelName:string){
    return  axios.post(`${API_BASE_URL}/api/servers/server/channel/create/${serverId}`,{
        channelName:channelName,
        type:type
    })
}

export async function createRoom(serverId:string | string[],channelId:string,roomName:string){
    return axios.post(`${API_BASE_URL}/api/rooms/room/create/${serverId}/${channelId}`,{
        roomName:roomName
    })
}

export async function createServer(userId:string,name:string,avatar:string){
    return axios.post(`${API_BASE_URL}/api/servers/server/create?userId=${userId}`, {
        name: name,
        avatar: avatar, // Use the downloadURL obtained from the storage or an empty string
    });
}

export async function getRandFriends(userId:string){
    return axios.get(`${API_BASE_URL}/api/user/friends/getRandom/${userId}`)
}

export async function getServer(serverId:string){
    return axios.get(`${API_BASE_URL}/api/servers//server/getServer?id=${serverId}`);
}


//User actions

export async function removeFriends(userId:string,friendId:string){
    return axios.delete(`${API_BASE_URL}/api/user/friends/removeFriend/${userId}/${friendId}`)
}

export async function getAllServers(userId:string){
    return axios.get(`${API_BASE_URL}/api/servers/getAll/${userId}`)
}

export async function getAllFriends(userId:string){
    return axios.get(`${API_BASE_URL}/api/user/friends/getAll/${userId}`)
}

export async function changeUserAvatar(userId:string,avatar:string){
    return axios.post(`${API_BASE_URL}/api/user/changeavatar/${userId}`,{
        avatar:avatar
    })
}

export async function changeNickname(userId:string,nickname:string){
    return axios.post(`${API_BASE_URL}/api/user/changenickname/${userId}`,{
        nickname:nickname
    })
}

export async function getAllInvites(userId:string){
    return axios.get(`${API_BASE_URL}/api/user/invites/getAll/${userId}`)
}

export async function getChat(chatId:string){
    return axios.get(`${API_BASE_URL}/api/chats/chat/getChat/${chatId}`)
}