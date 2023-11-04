'use client'
import { createAlert } from '@/redux/alertSlice'
import { findUser, getServer, joinServer } from '@/functions/handlers'
import useSession from '@/utils/useSession'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TbWorldWww } from 'react-icons/tb'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'


export default function InvitePage() {
    const searchParams = useSearchParams()
    const session = useSession()
    const router = useRouter()
    const dispatch = useDispatch()
   
    const [tokenExpired,setTokenExpired] = useState(false)
    const [loading,setLoading] = useState(true)
    const [tokenData,setTokenData] = useState<inviteToken | undefined>()
    const [tokenDataFetched,setTokenDataFetched] = useState({
        user:{
            _id:'',
            nickname:''
        },
        server:{} as Server
    })

    //Verify token
    useEffect(() => {
        async function runVerifyToken() {
            const token = searchParams.get('invt');
            if (token) {
                try {
                    jwt.verify(token, process.env.NEXT_PUBLIC_ABC!, async function (err, decoded) {
                        if (err) {
                            setTokenExpired(true);
                        } else {
                            if(!session._id){
                                const currentUrl = window.location.href;
                                localStorage.setItem('redirectAfterwards',currentUrl)
                                router.push('/');
                                return; 
                            }
                            if (typeof decoded === 'object' && decoded !== null) {
                                const decodedPayload = decoded as JwtPayload;

                                setTokenData(decodedPayload as inviteToken | undefined);

                                const server = await getServer(decodedPayload.serverId)
                                const sender = await findUser(session._id)

                                setTokenDataFetched((prev) => ({
                                    ...prev,
                                    user: {
                                        _id:sender._id,
                                        nickname:sender.nickname
                                    },
                                    server: server.data,
                                }));
                            }
                        }
                        setLoading(false);
                    });
                } catch (error) {
                    setTokenExpired(true);
                    setLoading(false);
                }
            } else {
                setTokenExpired(true);
                setLoading(false);
            }
        }
        runVerifyToken();
    }, [searchParams]);


    async function handleAcceptInvite(){
        try {
            if(!tokenExpired){
                await joinServer(tokenDataFetched.server._id,session._id!)
                router.push(`/servers/${session._id}/${tokenDataFetched.server._id}/${tokenDataFetched.server.channels[0].rooms[0]._id}`)
            }
        } catch (error:any) {
            dispatch(createAlert({type:"error",text:error.response.data}))
        }
    }
   
    if (loading) {
        // Render nothing while verifying the token
        return null
    }

  return (
    <>
        {tokenExpired ? 
            <div className='flex flex-col justify-center items-center w-screen h-screen text-slate-300'>
                <div className='flex items-center gap-3'>
                    <TbWorldWww size={150}/>
                    <div className='flex flex-col'>
                        <p>Your link has expired or is invalid.</p>
                        <Link 
                            href='/' 
                            className='flex justify-end text-green-700 cursor-pointer'
                        >
                            To login
                        </Link>
                    </div>
                </div>
            </div>
            :
            <div className='w-full h-screen flex items-center justify-center text-slate-300'>
                <div className='flex flex-col w-max h-max bg-[#36393e] rounded-md p-5 gap-5'>
                    <div className='flex flex-col'>
                        <p className='text-3xl font-bold'>
                            YOU HAVE BEEN INVITED 
                            <div className='w-full h-[3px] bg-[#1e2124]'/>
                            <br/>
                            <div className='flex gap-2 text-xl'>
                                <span className='text-green-700 opacity-60'>
                                    {tokenDataFetched.user.nickname}
                                </span> invited you to 
                                <span className='text-green-700'>
                                    {tokenDataFetched.server.name}
                                </span>!
                            </div>
                        </p>
                    </div>
                    <div className='flex gap-3'>
                        <div 
                            onClick={handleAcceptInvite} 
                            className='hover:bg-green-700 flex items-center justify-center border-green-700 border-[2px] w-[150px] h-[80px] rounded-md text-4xl cursor-pointer'
                        >
                            Join
                        </div>
                        <p className='opacity-50 flex items-end'>Your pass will expire in 7 days</p>
                    </div>
                </div>
            </div>
        }
    </>
  )
}
