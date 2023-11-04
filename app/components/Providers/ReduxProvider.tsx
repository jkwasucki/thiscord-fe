'use client'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

interface Props {
    children:ReactNode
}

export default function ReduxProvider({children}:Props) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}
