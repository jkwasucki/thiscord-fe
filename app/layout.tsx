'use client'
import { ServerEventProvider } from './components/Providers/ServerEventProvider'
import Alert from './components/Modals/Alert'
import ReduxProvider from './components/Providers/ReduxProvider'
import { PersistGate } from 'redux-persist/es/integration/react'
import { persistor } from '@/redux/store'
import './globals.css'
import { ScreenWidthProvider } from './components/Providers/MobileWrapper'
import Head from 'next/head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
   

  return (
        <html>
            <body className='overflow-hidden bg-[#1E2124]'>
                <ReduxProvider>
                    <PersistGate loading={null} persistor={persistor}>
                        <ServerEventProvider>
                            <ScreenWidthProvider>
                                <Alert/>
                                {children}
                            </ScreenWidthProvider>
                        </ServerEventProvider>
                    </PersistGate>
                </ReduxProvider>
            </body>
        </html>
  )
}
