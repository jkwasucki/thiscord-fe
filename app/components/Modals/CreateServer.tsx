'use client'
import { useServerContext } from '../Providers/ServerEventProvider'
import { storage } from '@/lib/firebase'
import useSession from '@/utils/useSession'
import readFile from '@/functions/fileReader'
import React, { useRef, useState } from 'react'
import { createServer } from '@/functions/handlers'
import { AiOutlineCamera, AiOutlineClose } from 'react-icons/ai'
import { createAlert } from '@/redux/alertSlice'
import { BsPlus } from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useDispatch } from 'react-redux'
import { useScreenWidth } from '../Providers/MobileWrapper'


type Props = {
    toggler: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateServer({toggler}:Props) {
    const dispatch = useDispatch()
    const router = useRouter()
    const session = useSession()
    const { shakeServerIcons } = useServerContext();
    const isMobile = useScreenWidth()
    
    let fileInputRef = useRef<HTMLInputElement | null>(null)
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [selectedFile,setSelectedFile] = useState<File>()
    const [serverName,setServerName] = useState('')

    const handleFileChange = async () => {
        const fileInput = fileInputRef.current;
      
        if (fileInput?.files?.length) {
            const selectedFile = fileInput.files[0];
            if (selectedFile) {
                setSelectedFile(selectedFile);
                const imgUrl = await readFile(selectedFile);
                setImageUrl(imgUrl);
            }
        }
    }

    function clearFileInput(){
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
            setImageUrl('')
            setSelectedFile(undefined)
          }
    }
    
    async function handleCreateServer() {
        if (serverName.length > 0) {
            try {
                let avatarValue = ""; // Default value for avatar
    
                if (selectedFile) {
                    const storageRef = ref(storage, `avatars`);
                    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    
                    await uploadTask;
    
                    // Get the download URL after the upload is complete
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setImageUrl(downloadURL);
    
                    // If an image is selected, set the avatar to the downloadURL
                    avatarValue = downloadURL;
                }
    
                const server = await createServer(session._id!,serverName,avatarValue)
    
                const serverId = server.data.serverId;
                const chatId = server.data.chatId;
    
                router.push(`/servers/${session._id}/${serverId}/${chatId}`);
                toggler(false);
                shakeServerIcons();
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }
    }
    
      
      
  return (
    <div className={`${isMobile && 'p-3'} bg-black bg-opacity-25 backdrop-blur-sm fixed inset-0 flex justify-center items-center w-screen h-screen z-40`}>
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.2, ease: "easeOut" }} 
            className='relative flex flex-col items-center w-[400px] bg-[#36393e] rounded-lg gap-5 p-5 text-slate-300'
            >
            <div onClick={()=>toggler(false)} className='absolute right-0 top-0 p-3 cursor-pointer'>
                <AiOutlineClose/>
            </div>
            <div className='flex flex-col items-center'>
                <p className='text-2xl font-semibold'>Create your server</p>
                <p className='opacity-50'>Choose your server's name and icon.</p>
            </div>
            {imageUrl ?
                <div 
                    onClick={() => { setImageUrl(undefined); clearFileInput(); }}  
                    className='cursor-pointer relative w-[80px] h-[80px] text-slate-300 border-dashed flex items-center justify-center border rounded-full border-white'>
                    <img 
                        src={imageUrl} 
                        className='w-full h-full object-cover rounded-full'
                    />
                </div>
                :
                <label 
                    htmlFor='input' 
                    className='cursor-pointer relative w-[80px] h-[80px] text-slate-300 border-dashed flex items-center justify-center border rounded-full border-white'
                    >
                    <div className='flex flex-col items-center'>
                        <AiOutlineCamera size={40}/>
                        <p className='text-sm'>Upload</p>
                    </div>
                    <div className='absolute right-0 top-0 w-6 h-6 bg-green-700 flex justify-center items-center rounded-full'>
                        <BsPlus size={20}/>
                    </div>
                    <input
                        id='input'
                        ref={fileInputRef}
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </label>
            }
            <div className='w-full h-full flex flex-col items-start gap-2'>
                <p>Server name</p>
                <div className='cursor-pointer pl-5 flex items-center justify-start w-full h-[50px] bg-[#282B30] rounded-md shadow-lg'>
                    <input 
                        type='text' 
                        onChange={(e)=>setServerName(e.target.value)} 
                        className='w-full h-full bg-transparent outline-none text-xl'
                    />
                </div>
            </div>
            <div 
                onClick={handleCreateServer} 
                className='cursor-pointer flex items-center justify-center w-[150px] h-[50px] bg-green-700 rounded-md'
            >
                <p>Create</p>
            </div>
        </motion.div>
    </div>
  )
}
