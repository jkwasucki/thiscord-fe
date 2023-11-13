'use client'
import { AiFillWechat } from "react-icons/ai"



export default function NoChatFound() {
  
  return (
        <div className='relative z-10 flex flex-col justify-center items-center sm:w-[1300px] sm:h-full text-white text-sm pt-12 bg-[#36393e] p-2'>
           <div className="flex flex-col items-center text-slate-300">
                <AiFillWechat size={100}/>
                <p className="text-xl">Chat not found.</p>
                <p className="opacity-50">People used to talk here... once.</p>
           </div>
        </div>
    )
}