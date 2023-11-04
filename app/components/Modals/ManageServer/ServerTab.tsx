import { changeAvatar, deleteServer, manageServerPrivacy, serverNameChange } from '@/functions/handlers'
import { createAlert } from '@/redux/alertSlice'
import { useServerContext } from '../../Providers/ServerEventProvider'
import { useScreenWidth } from '../../Providers/MobileWrapper'
import readFile from '@/functions/fileReader'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { GrChannel } from 'react-icons/gr'

type Props = {
    serverData:Server | undefined
}

export default function ServerTab({serverData}:Props) {
    const { name,_id, isPublic, avatar} = serverData as Server
    const isMobile = useScreenWidth()
    const { shakeServerIcons, shakeServer } = useServerContext();
    const dispatch = useDispatch()
    const router = useRouter()

    const [badPhrase,setBadPhrase] = useState(false)
    const [deletePhrase,setDeletePhrase] = useState('')
    const [newName,setNewName] = useState('')
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = fileInputRef.current;
    
        if (fileInput?.files && fileInput.files.length > 0) {
            const selectedFile = fileInput.files[0];
            const imgUrl = await readFile(selectedFile);
            try{
                const response = await changeAvatar(_id,imgUrl!)
                shakeServer()
                dispatch(createAlert({type:"info",text:response.data}))
            }catch(err){
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }
    };
    
    async function handleNameChange(){
        if(newName.length > 0){
            try {
                const response = await serverNameChange(_id,newName)
                shakeServer()
                shakeServerIcons()
                setNewName('')
                dispatch(createAlert({type:'info',text:response.data}))
            } catch (error) {
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }
    }

    async function handleDelete(){
        if(deletePhrase === name){
            try{
                await deleteServer(_id)
                .then(()=>{
                    shakeServerIcons()
                })
                router.push('/servers/me')
            }catch(error){
                dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
            }
        }else{
            setBadPhrase(true)
        }
        
    }
   
    async function handlePrivacy(type:boolean){
        try {
            await manageServerPrivacy(_id,type)
            shakeServer()
        } catch (error) {
            dispatch(createAlert({type:"error",text:"Something went wrong, try again later"}))
        }
    }
   
  return (
    <>
        <div className='sm:w-2/3 w-max sm:h-screen flex flex-col py-12 px-8 gap-5 sm:overflow-y-auto cursor-default'>
            <p className='text-2xl'>Server settings</p>
            <div className='flex flex-col gap-2'>
                <p>Change server name</p>
                <div className='flex items-center px-2 h-8 w-[300px] bg-[#282b30] rounded-md'>
                    <input 
                        value={newName}
                        onChange={(e)=>setNewName(e.target.value)} 
                        type='text' 
                        className='w-full h-full bg-transparent outline-none text-slate-300 px-2' 
                    />
                    <p onClick={handleNameChange}>Submit</p>
                </div>
            </div>
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2'>
                    <p className='text-2xl'>Privacy</p>
                    <div className={`flex flex-col `}>
                        <p className={`${isMobile && 'max-w-[350px]'} text-sm opacity-50`}>
                            Public - Your server can be searched and joined without asking for permission.
                        </p>
                        <p className={`${isMobile && 'max-w-[350px]'} text-sm opacity-50`}>
                            Private - You can only invite users to your server via link.
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <div 
                        onClick={()=>handlePrivacy(true)} 
                        className={`${isPublic ? "bg-black" : "bg-[#46494f]"} rounded-md bg-[#46494f] px-2`}
                    >
                        <p>Public</p>
                    </div>
                    <div 
                        onClick={()=>handlePrivacy(false)} 
                        className={`${isPublic ? "bg-[#46494f]" : "bg-black"} rounded-md  px-2`}
                    >
                        <p>Private</p>
                    </div>
                </div>
            </div>
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex items-center gap-12'>
                <div className='flex flex-col gap-3'>
                    <header className='text-2xl'>Avatar</header>
                    <input
                        id='fileInput'
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label 
                        htmlFor='fileInput'
                        className='flex justify-center items-center w-max px-2 rounded-md h-8 bg-green-700'
                    >
                        <p>Change avatar</p>
                    </label>
                </div>
                <div className='rounded-full w-[100px] h-[100px]'>
                    {avatar ?
                    <img src={avatar} className='w-full h-full object-cover rounded-full'/>
                    :
                    <div className='w-full h-full flex items-center justify-center bg-green-700 rounded-full'>
                        <GrChannel size={50}/>
                    </div>
                    }
                </div>
            </div>
            
            <div className='w-1/2 h-[2px] bg-[#282b30]'/>
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3'>
                    <header className='text-2xl text-red-500'>Delete server</header>
                    {badPhrase && <p className='text-sm text-red-400'>Phrase must match</p>}
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <p className='flex gap-2 text-sm opacity-50'>
                            WARNING: Deletion is irreversible.
                        </p>
                        <div className='flex items-center gap-2'>
                            <p className='flex gap-2 text-sm opacity-50'> 
                                In order to do so, retype the phrase:
                            </p>
                            <p className='text-white select-none text-sm'>{name}</p>
                        </div>
                    </div>
                    <div className='flex items-center px-2 h-8 w-[300px] bg-[#282b30] rounded-md'>
                        <input 
                            onChange={(e)=>setDeletePhrase(e.target.value)} 
                            type='text' 
                            className='w-full h-full bg-transparent outline-none text-slate-300 px-2' 
                        />
                        <p onClick={handleDelete}>Submit</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
