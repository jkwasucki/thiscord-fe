declare module '*.mp3' {
    const value: string;
    export default value;
  }
  
type resetToken ={
    email:string,
    exp:number,
    iat:number,
    _id:string
}

type inviteToken = {
    exp: number;
    iat: number;
    serverId: string;
    userId:string
}

type User = {
    _id:string | null,
    email:string,
    password:string,
    nickname:string,
    avatar:string,
    tag:number,
    friends:[
        {
            _id:ObjectId,
            chatId:ObjectId
        }
    ],
    servers:Array,
    notifications:Array,
}

type Chat = {
    type:string,
    name:string,
    _id:ObjectId,
    messages:Message[],
    pinned:Message
}

type Server = {
    _id:ObjectId,
    permissions:{
        owner:String,
        vips:[ObjectId],
        admins:[ObjectId]
    },
    name:string,
    owner:string,
    avatar:string,
    isPublic:boolean,
    channels:Channel[],
    users: User[]
}

type Channel = {
    _id:ObjectId,
    chanType:string,
    title:string,
    rooms:Room[]
}

type Room = {
    _id:ObjectId
    name:string,
}

type Message = {
    _id:ObjectId,
    type:string
    text:string,
    sender:string,
    timestamp:string,
    user:User
}


type Notifications = {
    _id: ObjectId,
    text: string,
    type: string,
    payload:{
        triggeredById?:string,
        triggeredByNickname?:string,
        serverId?:string,
    }
}

type Friend = {
    _id: ObjectId,
    avatar: string,
    nickname: string,
    email: string,
    chatId: string
}