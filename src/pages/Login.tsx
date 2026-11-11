import { Navigate, Route, Routes, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import EmailStep from '../components/settings/login/EmailStep'
import VerifyStep from '../components/settings/login/VerifyStep'
import Welcome from '../components/settings/login/Welcome'

// Login flow (Figma "Login - Sign Up - Email - OTP Flow"): /login → /login/email → /login/verify. Live: book.tripket.ph/login.
// Once signed in (or when a signed-in user opens a login URL) go back to where the user came from (location state `from`) or Home.
export default function Login() {
  const { user } = useAuth()
  const { state } = useLocation()
  if (user) return <Navigate to={(state as { from?: string } | null)?.from ?? '/'} replace />
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="email" element={<EmailStep />} />
      <Route path="verify" element={<VerifyStep />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
