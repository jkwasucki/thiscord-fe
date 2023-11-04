import { createAlert } from '@/redux/alertSlice'
import useSession from '@/utils/useSession'
import { findFriend, getRandFriends, inviteToServer } from '@/functions/handlers'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import jwt from 'jsonwebtoken'
import { useDispatch } from 'react-redux'
import { useScreenWidth } from '../Providers/MobileWrapper'

type Props = {
    userId:string,
    serverId:string,
    serverName:string,
    toggler:React.Dispatch<React.SetStateAction<boolean>>
}

export default function SendServerInvite({userId,serverId,serverName,toggler}:Props) {
    const session = useSession()
    const dispatch = useDispatch()
    const isMobile = useScreenWidth()

    const [searchResults,setSearchResults] = useState<User[]>([])
    const [search,setSearch] = useState('')

    const [copied,setCopied] = useState(false)
    const [randFriends,setRandFriends] = useState<User[]>([])

    const invitationLinkRef = useRef<HTMLParagraphElement>(null);
    const [invitedFriendsTempState,setInvitedFriendsTempState] = useState({
        list:[{
            _id:''
        }]
    })

    //Fetch initial 3 random friends
    useEffect(()=>{
        async function fetch3Friends(){
            const randFriends = await getRandFriends(session._id!)
            setRandFriends(randFriends.data)
        }
        fetch3Friends()
    },[])

    //Dynamic friend search
    useEffect(()=>{
        async function fetchSearchResults(){
            if(search.length > 0){
                try{
                    const searchResults = await findFriend(session._id!,search)
                    setSearchResults(searchResults.data)
                }catch(err){
                    setSearchResults([])
                }
            }else{
                setSearchResults([])
            }
        }
        fetchSearchResults()
    },[search])

    const handleCopyClick = () => {
        if (invitationLinkRef.current) {

            const tokenData = {
                userId: userId,
                serverId: serverId
            }
            // Create a token with the data
            let validToken = jwt.sign(tokenData, process.env.NEXT_PUBLIC_ABC!, { expiresIn: '100000' });

            // Append the token to the link without changing the visual representation
            invitationLinkRef.current.textContent += `?invt=${validToken}`;
    
            // Select the text inside the input field
            const range = document.createRange();
            range.selectNode(invitationLinkRef.current);
            
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.addRange(range);
    
            // Copy the selected text
            document.execCommand('copy');
    
            // Deselect the text
            selection!.removeAllRanges();
            invitationLinkRef.current.textContent = 'http://localhost:3000/invite'
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    async function handleSendInvite(friendId:string){
        try {
            
            await inviteToServer(serverId,session._id!,friendId)
            setInvitedFriendsTempState((prev) => ({
                ...prev,
                list: [...prev.list, { _id:friendId }],
            }));
        } catch (error:any) {
            dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }

return (
    <div className={`${isMobile && 'p-3'} bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-40 cursor-default`}>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.2, ease: "easeOut" }} 
            className='relative  flex flex-col justify-start w-[400px] bg-[#36393e] rounded-lg gap-10 p-5 text-slate-300 shadow-xl'
            >
            <AiOutlineClose 
                onClick={()=>toggler(false)} 
                className='absolute right-4 top-4 cursor-pointer hover:text-white'
            />
            <div className='flex flex-col gap-3'>
                <p>Invite friends to: {serverName}</p>
                <div className='relative flex items-center w-full h-8 bg-[#282b30] rounded-md px-2'>
                    <input
                        onChange={(e)=>setSearch(e.target.value)}
                        type='text' 
                        placeholder='Search friends' 
                        className='w-full h-full bg-transparent outline-none px-3'
                    />
                    <BiSearch/>
                    <div className='absolute top-[35px] z-30 left-[2px] bg-[#282b30] mah-h-[300px] border-[#1e2124] w-full'>
                    {searchResults.length > 0 && searchResults?.map((user:User)=>{
                        return(
                            <div
                                onClick={()=>handleSendInvite(user._id!)} 
                                key={user?._id} 
                                className='cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-[#424549]'
                                >
                                <div className='w-8 h-8 rounded-full'>
                                    <img 
                                        src={user?.avatar === 'default' ? '/avatar.png' : user?.avatar} 
                                        className='w-full h-full object-cover rounded-full '
                                    />
                                </div>
                                <p>{user?.nickname}</p>
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div className='w-full h-[1px] bg-[#1e2124]'/>
            </div>
            <div className='flex flex-col gap-3'>
            {randFriends?.map((user:User)=>{
                return(
                    <div 
                        className='flex items-center justify-between w-full bg-[#424549] px-2 py-1 rounded-md'
                        >
                        <div className='flex items-center gap-3'>
                            <div className='w-[40px] h-[40px] rounded-full'>
                                <Image 
                                    width={200} 
                                    height={200} 
                                    alt='avatar' 
                                    src={user.avatar === 'default'? '/avatar.png' : user.avatar}
                                    className='rounded-full w-full h-full object-cover'
                                />
                            </div>
                            <p>{user.nickname}</p>
                        </div>
                        <div
                            onClick={()=>handleSendInvite(user._id!)} 
                            className='hover:bg-green-700 cursor-pointer flex items-center justify-center w-[80px] h-[40px] border border-green-700 rounded-md'>
                        {invitedFriendsTempState
                            .list
                            .some((selectedUser) => selectedUser._id === user._id) ?
                                <p className='font-semibold bg-green-700 w-full h-full flex items-center justify-center'>
                                    Sent!
                                </p> 
                                : 
                                <p>Invite</p>
                        }
                        </div>
                    </div>
                )
            })}
            </div>
            <div className='flex flex-col'>
                <p>Or, send them your invitation link</p>
                <div className='flex items-center justify-between w-full h-12 bg-[#1e2124] rounded-md pl-4 pr-2'>
                    <p ref={invitationLinkRef}>http://localhost:3000/invite</p>
                    <div className='cursor-pointer flex items-center justify-center w-[80px] h-9 bg-[#7289da] rounded-md'>
                        <p 
                            onClick={handleCopyClick} 
                            className={`${copied && 'font-semibold'} text-white`}
                        >
                                {copied ? "Copied" : "Copy"}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
  )
}
