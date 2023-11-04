import React from 'react'
import { useScreenWidth } from '../Providers/MobileWrapper'

type Props = {
  text:string
}

export default function TooltipLeft({text}:Props) {

  const isMobile = useScreenWidth()

  return !isMobile && (
        <div className="group opacity-0 px-3 left-[50px] -translate-y-1/2 bg-[black] w-max h-max top-1/2 text-white text-center text-sm rounded-lg py-2 absolute z-30 group-hover:opacity-100 -bottom-1/2 -ml-3 pointer-events-none">
           {text}
            <div className='absolute left-[-8px] top-1/2 transform -translate-y-1/2'>
                <svg className="relative text-black h-2 " x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                    <polygon fill='black' className=" left-0 w-full h-full absolute" points="255,0 127.5,127.5 255,255"/>
                </svg>
            </div>
        </div>
    
  )
}
