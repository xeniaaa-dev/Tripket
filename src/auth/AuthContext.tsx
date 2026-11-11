/* oxlint-disable react/only-export-components -- context file: provider + hook */
import { createContext, useContext, useState, type ReactNode } from 'react'

// In-memory auth for the prototype (no persistence, no backend): any email signs in.
export type User = { email: string; name: string; initials: string }

type Auth = { user: User | null; signIn: (email: string) => void; signOut: () => void }

const AuthCtx = createContext<Auth>({ user: null, signIn: () => {}, signOut: () => {} })

/** "maria.santos@email.com" → { name: "Maria Santos", initials: "MS" } */
export function userFromEmail(email: string): User {
  const parts = email.split('@')[0].split(/[._\-+\d]+/).filter(Boolean)
  const words = parts.length ? parts : ['User']
  const name = words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase()
  return { email, name, initials }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return (
    <AuthCtx value={{ user, signIn: (email) => setUser(userFromEmail(email.trim())), signOut: () => setUser(null) }}>
      {children}
    </AuthCtx>
  )
}

export const useAuth = () => useContext(AuthCtx)
