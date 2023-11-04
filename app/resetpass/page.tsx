//TODO: Transfer token in the request headers (e.g., in the Authorization header) rather than in the URL

'use client'
import { changePassword, verifyToken } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {TbWorldWww} from 'react-icons/tb'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'

export default function ResetPasswordLink() {
    const router = useRouter()
    const dispatch = useDispatch()

    const [tokenExpired,setTokenExpired] = useState(false)
    const [extractedUserData,setExtractedUserData] = useState<resetToken | undefined>()
    const [loading, setLoading] = useState(true)
    const [inputFocusNew,setInputFocusNew] = useState('1e2124')
    const [inputFocusConfirm,setInputFocusConfirm] = useState('1e2124')
    const [pass,setPass] = useState({
        new:'',
        confirm:''
    })

    const searchParams = useSearchParams()
    
    //Verify token
    useEffect(() => {
        async function runVerifyToken() {
            const token = searchParams.get('tkn')
            if(token){
                try {
                    const userData = await verifyToken(token)
                    setExtractedUserData(userData.data)
                } catch (error) {
                    setTokenExpired(true)
                } finally {
                    setLoading(false)
                }
            }else{
                setTokenExpired(true)
            }
        }
        runVerifyToken()
    }, [])
    
    if (loading) {
        // Render nothing while verifying the token
        return null
    }

    async function handlePassChange(){
        if(pass.confirm === pass.new){
            await changePassword({
                userId:extractedUserData!._id,
                newPassword:pass.new
            })
            .then(()=>{
                router.push('/')
                dispatch(createAlert({type:'info',text:'Password changed succesfully!'}))
            })
        }else{
            dispatch(createAlert({type:'error',text:'Passwords must match.'}))
            setInputFocusNew('b91c1c')
            setInputFocusConfirm('b91c1c')
        }
    }
   
  return (
    <>
        {tokenExpired ? 
        <div className='flex flex-col justify-center items-center w-screen h-screen text-slate-300'>
            <div className='flex items-center gap-3'>
                <TbWorldWww size={150}/>
                <div className='flex flex-col'>
                    <p>Your link has expired or is invalid.</p>
                    <Link href='/' className='flex justify-end text-green-700 cursor-pointer'>To login</Link>
                </div>
            </div>
        </div>
        :
        <div className='flex justify-center items-center w-screen h-screen'>
            <div className='flex flex-col justify-center w-[450px] h-max bg-[#36393e] rounded-lg p-5 text-slate-300 text-xl gap-5'>
                <p className='text-[30px] font-thin'>Reset your password</p>
                <p className='text-sm text-slate-300 opacity-50'>Password must be atleast 5 characters.</p>
                <div className='flex flex-col text-sm'>
                    <p>Enter new password</p>
                    <div className='w-full h-12 bg-[#1E2124] rounded-lg border' style={{ borderColor: `#${inputFocusNew}` }}>
                        <input 
                            onChange={(e)=>setPass((prev)=>({...prev,new:e.target.value}))} 
                            type='password' 
                            className='px-2 bg-transparent w-full h-full outline-none text-white'
                        />
                    </div>
                </div>
                <div className='flex flex-col text-sm'>
                    <p>Confirm new password</p>
                    <div className='w-full h-12 bg-[#1E2124] rounded-lg border' style={{ borderColor: `#${inputFocusConfirm}` }}>
                        <input 
                            onChange={(e)=>setPass((prev)=>({...prev,confirm:e.target.value}))} 
                            type='password' 
                            className='px-2 bg-transparent w-full h-full outline-none text-white'
                        />
                    </div>
                </div>
                <div 
                    onClick={handlePassChange} 
                    className='cursor-pointer flex items-center justify-center w-[200px] h-12 bg-green-700 rounded-lg'
                >
                    <p>Continue</p>
                </div>
            </div>
        </div>  
        }
    </>
   
  )
}
