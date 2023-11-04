import { changeNickname, changeUserAvatar, refetchUser } from '@/functions/handlers';
import { storage } from '@/lib/firebase';
import { createAlert } from '@/redux/alertSlice';
import { createSession } from '@/redux/userSlice';
import useSession from '@/utils/useSession';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react'
import { AiFillEdit, AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useScreenWidth } from '../Providers/MobileWrapper';


type Props = {
    toggler:React.Dispatch<React.SetStateAction<boolean>>
}
export default function ManageUser({toggler}:Props) {
    const session = useSession()
    const dispatch = useDispatch()
    const isMobile = useScreenWidth()


    const [nickname,setNickname] = useState('')
    
    let fileInputRef = useRef<HTMLInputElement | null>(null)

    async function handleChangeAvatar(){
        try {
            const fileInput = fileInputRef.current;
      
            if (fileInput?.files?.length) {
                const selectedFile = fileInput.files[0];
               
                if (!selectedFile) {
                    console.error('No file selected');
                    return;
                }
    
                const storageRef = ref(storage, `avatars`);
                const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        
                await uploadTask;
        
                // Get the download URL after the upload is complete
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                await changeUserAvatar(session._id!,downloadURL)
                const user = await refetchUser(session._id!)
                dispatch(createSession(user.data))
            }
        } catch (error) {
            dispatch(createAlert({type:"error",text:"Something went wrong, try again later."}))
        }
    }

    async function handleChangeNickname(){
        try {
            await changeNickname(session._id!,nickname)
            setNickname('')
            const user = await refetchUser(session._id!)
            dispatch(createSession(user.data))
        } catch (error) {
            dispatch(createAlert({type:"error",text:"Something went wrong, try again later."}))
        }
    }


  return (
    <div className={`${isMobile && 'p-3'} bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-50 cursor-default`}>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.2, ease: "easeOut" }} 
            className='relative flex flex-col w-[400px] bg-[#36393e] rounded-lg gap-5 p-5 text-slate-300'
            >
            <AiOutlineClose 
                onClick={()=>toggler(false)}
                className='absolute right-5 top-5 cursor-pointer hover:text-white'
            />
            <div className='flex flex-col gap-6'>
                <div className='flex items-end gap-3'>
                    <div className='relative w-[100px] h-[100px] rounded-full'>
                        <label 
                            htmlFor='input' 
                            className='p-1 cursor-pointer rounded-full bg-[#1e2124] absolute bottom-0 right-0'
                        >
                            <AiFillEdit size={20} className=''/>
                        </label>
                        <img 
                            src={session.avatar === 'default'? '/avatar.png' : session.avatar} 
                            className='w-full h-full object-cover rounded-full'
                        />
                    </div>
                    <input
                        id='input'
                        ref={fileInputRef}
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleChangeAvatar}
                    />
                    <p className='text-2xl'>{session.nickname}</p>
                </div>
                <div className='flex flex-col'>
                    <p>Change nickname</p>
                    <div className='flex justify-between items-center w-[280px] h-8 bg-[#282b30] rounded-md px-2'>
                        <input 
                            onChange={(e)=>setNickname(e.target.value)}
                            value={nickname}
                            type='text' 
                            className='w-full h-full outline-none bg-transparent'
                        />
                        <p 
                            onClick={handleChangeNickname} 
                            className='hover:text-white'
                        >
                            Submit
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
  )
}
