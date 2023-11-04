import React from 'react'
type Props = {
  channel:string
}
export default function WelcomeMsgChannel({channel}:Props) {
  return (
    <div className='flex flex-col py-12 gap-3 text-slate-300'>
        <div className='flex items-center justify-center rounded-full bg-[#424549] h-[80px] w-[80px]'>
            <p className='text-[80px]'>#</p>
        </div>
        <div className='flex flex-col gap-3'>
            <p className='text-[40px] font-semibold'>Welcome on: {channel}!</p>
            <p className='text-xl opacity-50'>This is just the beginning.</p>
        </div>
    </div>
  )
}
