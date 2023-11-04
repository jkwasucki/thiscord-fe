'use client'
import MouseInactivityDetector from "@/functions/statusTracker"
import Servers from "../components/Globals/Servers"
import useSession from "@/utils/useSession"
import { useEffect, useState } from "react"
import socket from "@/lib/socket"
import cookie from 'js-cookie'
import { useParams, useRouter } from "next/navigation"
import { JwtPayload } from "jsonwebtoken"
import jwt from 'jsonwebtoken'
import { useScreenWidth } from "../components/Providers/MobileWrapper"
import Head from 'next/head';

export default function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const session = useSession()
  
    //Establishes connection throughout the app
    
      socket.connect()
      socket.emit('join',session._id)

  

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 430);
    
    const router = useRouter()
    const params = useParams()
    const isMobile = useScreenWidth()
    //Check if auth-token is present
    //Check if userId param matches
    useEffect(()=>{
        const tokenValue = cookie.get('token');
        console.log(tokenValue)
        // if(!tokenValue){
        //     router.push('/');
        // }
        // if (tokenValue) {
        //     const decodedToken = jwt.decode(tokenValue!) as JwtPayload;
        
        //     if (decodedToken && '_id' in decodedToken) {
        //         if(params.sessionId){
        //             if(decodedToken._id !== params.sessionId){
        //                 router.push('/not-found');
        //             }
        //         }
                
        //     }
        // } 
    },[])
    
    const handleStatus = (status:string) => {
      
        if(status === 'inactive'){
          socket.emit('inactive',{text:'inactive',_id:session._id})
         
        }else if(status === 'active'){
          socket.emit('active',{text:'active',_id:session._id})
        }
    
    };

  
  
    
  // Update the state when the window is resized
  useEffect(() => {
    const handleResize = () => {
      
        setIsSmallScreen(window.innerWidth <= 430);

    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


   useEffect(() => {
    // Disable double-tap gesture for zooming on mobile devices
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });

    // Optional: You can also prevent pinch-to-zoom
    document.addEventListener('touchmove', function (e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }, []);


    return (
      <section className='fixed inset-0 w-screen h-screen overflow-x-hidden overflow-y-hidden flex bg-[#1e2124]'>
          <Servers/>
          <MouseInactivityDetector 
            onInactive={()=>handleStatus('inactive')} 
            onActive={()=>handleStatus('active')}
          />
          {children}
      </section>
    )
  }
  