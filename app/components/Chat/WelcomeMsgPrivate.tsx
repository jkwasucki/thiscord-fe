import React from 'react'
type Props = {
  nickname:string
}
export default function WelcomeMsgPrivate({nickname}:Props) {
  return (
    <div className='flex flex-col py-12 gap-3 text-slate-300'>
        <div className='flex items-center justify-center rounded-full bg-[#424549] h-[80px] w-[80px]'>
            <p className='text-[80px]'>#</p>
        </div>
        <div className='flex flex-col gap-3'>
            <p className='text-3xl font-semibold'>Say hello to {nickname}!</p>
            <p className='opacity-50'>This is just the beginning.</p>
        </div>
    </div>
  )
}
