/* eslint-disable react-hooks/refs */
'use client'

import { useUser } from '@/store/user.store'
import { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'

export const useSocket = () => {
  const { user, isAuth } = useUser()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isAuth && user?.id) {
      const SERVER_URL =
        process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4200'

      socketRef.current = io(`${SERVER_URL}/notifications`, {
        query: { userId: user.id },
        transports: ['websocket'],
        withCredentials: true, // Позволяет браузеру передать куки в Handshake
        forceNew: true
      })

      socketRef.current.on('connect', () => {
        setIsConnected(true)
      })

      socketRef.current.on('disconnect', () => {
        setIsConnected(false)
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isAuth, user?.id])

  return { socket: socketRef.current, isConnected }
}
