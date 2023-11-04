'use client'
import useSession from '@/utils/useSession'
import { useRouter } from 'next/navigation'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { SiAiqfome } from 'react-icons/si'
 
export default function Error() {

  return (
    <div className='min-w-full min-h-screen flex flex-col items-center justify-center bg-[#1e2124] gap-5 text-slate-300'>
        <div className='flex flex-col items-center gap-2'>
            <SiAiqfome size={55}/>
            <p className='font-semibold'>Something went wrong...</p>
        </div>
        <div className='flex flex-col items-center gap-3'>
          <h2 className='text-xl'>Not the best place to end up, eh?</h2>
        </div>
    </div>
  )
}