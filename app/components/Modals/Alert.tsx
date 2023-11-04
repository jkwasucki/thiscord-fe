'use client'
import { clearAlert } from '@/redux/alertSlice'
import { RootState } from '@/redux/store'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

export default function Alert() {
    const dispatch = useDispatch()
    //Check if alert is already on, if so, then block incoming trigger.
    const [alertOn,setAlertOn] = useState(false)

    const alert = useSelector((state: RootState) => state.alertReducer.alert)
    
    
    useEffect(()=>{
        if(!alertOn){
            setAlertOn(true)
            setTimeout(()=>{
                setAlertOn(false)
                dispatch(clearAlert({}))
            },3000)
        }
    },[alert])
    
  return (
    <>
    {alert.type === 'error'  &&  alertOn &&
        <div className='fixed left-1/2 -translate-x-1/2 z-50'>
            <motion.div 
                initial={{y:-200}}
                animate={{ x: 0,
                    y: [-150, 20, 20, 20,-150],
                    scale: 1,
                    rotate: 0,
                }}
                transition={{ duration: 3}} 
                className='p-3 border-red-900 border-[2px] flex items-center justify-center  w-max rounded-lg h-12 bg-red-500'
                >
                    <p className='text-slate-300'>{alert.text}</p>
            </motion.div>
        </div>
    }
    {alert.type === 'info' && alertOn &&
        <div className='fixed left-1/2 -translate-x-1/2 z-50'>
            <motion.div 
                initial={{y:-200}}
                animate={{ x: 0,
                    y: [-150, 20, 20, 20,-150],
                    scale: 1,
                    rotate: 0,
                }}
                transition={{ duration: 3}} 
                className='p-3 border-green-900 border-[2px] flex items-center justify-center  w-max rounded-lg h-12 bg-green-700'
                >
                    <p className='text-slate-300'>{alert.text}</p>
            </motion.div>
        </div>  
    }
    </>
  )
}
