import ChannelsTab from './ChannelsTab'
import UsersTab from './UsersTab'
import ServerTab from './ServerTab'
import { useScreenWidth } from '../../Providers/MobileWrapper'
import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { motion } from 'framer-motion'

type Props = {
    toggler: (value: React.SetStateAction<boolean>) => void,
    serverData:Server | undefined
}


export default function ManageServer({toggler,serverData}:Props) {
    const isMobile = useScreenWidth()

    const [tab,setTab] = useState('Server')

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.5 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.2, ease: "easeOut" }} 
        className=' w-screen h-screen bg-[#36393e] fixed inset-0 flex justify-start text-slate-300 items-center z-40'
        >
        <div className='absolute right-5 top-5 p-3 cursor-pointer'>
            <div className='flex flex-col items-center'>
                <AiOutlineCloseCircle size={40} onClick={()=>toggler(false)}/>
               { !isMobile &&  <p>ESC</p>}
            </div>
        </div>
        <div className={`
            ${isMobile ? "flex flex-col w-screen h-full":"w-full h-full flex justify-start" } 
            overflow-y-auto`
            }>
            <div className={`
                ${!isMobile && "w-[340px] h-screen flex justify-end py-12 bg-[#282b30]"}`
                }>
                <div className={`
                    ${isMobile ? 'flex pt-5' : "flex flex-col"} 
                    text-xl px-5 gap-3`
                    }>
                    {!isMobile && 
                        <p className='text-xl px-2 font-light'>
                            Manage server
                        </p>
                    }
                    <p 
                        onClick={()=>setTab('Server')} 
                        className={`
                            ${tab === 'Server' && 'text-green-600 bg-[#36393e]'} 
                            hover:bg-[#36393e] rounded-md text-md py-1 px-2
                        `}
                    >
                        Server
                    </p>
                    <p 
                        onClick={()=>setTab('Channels')} 
                        className={`
                            ${tab === 'Channels' && 'text-green-600 bg-[#36393e]'} 
                            hover:bg-[#36393e] rounded-md text-md py-1 px-2
                        `}
                    >
                        Channels
                    </p>
                    <p 
                        onClick={()=>setTab('Users')} 
                        className={`
                            ${tab === 'Users' && 'text-green-600 bg-[#36393e]'} 
                            hover:bg-[#36393e] rounded-md text-md py-1 px-2
                        `}
                    >
                        Users
                    </p>
                </div>
            </div>
            {tab === 'Server' &&  <ServerTab serverData={serverData}/> }
            {tab === 'Channels' &&  <ChannelsTab serverData={serverData}/> }
            {tab === 'Users' &&  <UsersTab serverData={serverData}/> }
        </div>
    </motion.div>
  )
}
