'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { type User } from '~/server/api/routers/user'

interface UserContextType {
  user: User | null
  createUser: (userData: Omit<User, 'id'>) => void
  updateUser: (data: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user data from localStorage on initial render
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User)
    }
  }, [])

  const createUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(), // Generate a simple ID (use UUID in production)
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updatedUser = { ...prev, ...data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  return (
    <UserContext.Provider value={{ user, createUser, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

