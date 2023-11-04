
import {SiAiqfome} from 'react-icons/si'
export default async function NotFound() {
  return (
    <div className='min-w-full min-h-screen flex flex-col items-center justify-center bg-[#1e2124] gap-5 text-slate-300'>
        <div className='flex flex-col items-center gap-2'>
            <SiAiqfome size={55}/>
            <p className='font-semibold'>404 | Page not found</p>
        </div>
      <h2 className='text-xl'>I don't know what you are looking for... but it's not here.</h2>
    </div>
  )
}