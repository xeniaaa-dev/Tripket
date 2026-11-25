import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../../auth/AuthContext'
import { lastSignIn, setLastSignIn, type SignInMethod } from '../../../auth/lastMethod'
import { loginDraft } from './draft'
import logo from '../../../assets/figma/settings/login-logo.svg'
import loginBg from '../../../assets/figma/settings/login-bg.png'
import { showSuccess } from '../../passengers/Toast'
import { MailIcon } from '../icons'

// Welcome / login (user's reference screenshot): full-bleed sunset photo, logo + "Welcome back" block,
// Google / Apple / Facebook buttons, "OR CONTINUE WITH" divider, glass "Sign in with Email", "Continue as guest" link.
// The method used last time gets a "Last used" tag on its button (top-right, over the edge) (email kept for prefill):
// "Sign in with Email" prefills the email used last time.
// The social buttons are prototype-only: they sign in with a sample email (Tripket only keeps the email) and show the welcome toast.

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
  </svg>
)
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.37 12.6c-.02-2.33 1.9-3.45 1.99-3.5-1.08-1.59-2.77-1.8-3.37-1.83-1.43-.15-2.8.84-3.53.84-.73 0-1.85-.82-3.04-.8-1.56.03-3 .91-3.81 2.31-1.62 2.82-.41 6.99 1.17 9.28.77 1.12 1.69 2.38 2.9 2.33 1.16-.05 1.6-.75 3.01-.75 1.4 0 1.8.75 3.03.73 1.25-.02 2.04-1.14 2.81-2.27.88-1.3 1.25-2.56 1.27-2.62-.03-.01-2.43-.93-2.45-3.7ZM14.05 5.75c.64-.78 1.08-1.86.96-2.94-.93.04-2.05.62-2.71 1.39-.6.69-1.12 1.79-.98 2.85 1.03.08 2.09-.53 2.73-1.3Z" />
  </svg>
)
const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="11" fill="#fff" />
    <path fill="#1877F2" d="M13.4 23v-8.06h2.7l.4-3.14h-3.1v-2c0-.91.25-1.53 1.56-1.53h1.66V5.46a22 22 0 0 0-2.42-.12c-2.4 0-4.04 1.46-4.04 4.15v2.31H7.44v3.14h2.72V23h3.24Z" />
  </svg>
)

/** "Last used" pill sitting on the button's top edge */
const LastUsed = () => (
  <span className="absolute -top-[10px] right-[14px] rounded-full bg-[#f97316] px-[8px] py-[2px] text-[11px] leading-[16px] font-semibold tracking-normal text-white shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
    Last used
  </span>
)

const btn = 'relative flex h-[52px] w-full items-center justify-center gap-[12px] rounded-16 text-[16px] font-semibold tracking-[-0.3px] transition-transform active:scale-[0.98]'

export default function Welcome() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { signIn } = useAuth()
  const from = (state as { from?: string } | null)?.from
  // prototype SSO: sign in right away with a sample email; <Login> then redirects to `from` or Home
  const last = lastSignIn()
  const sso = (method: SignInMethod, email: string) => {
    setLastSignIn({ method, email })
    signIn(email)
    setTimeout(() => showSuccess(`Welcome, ${email}! You're logged in.`), 300)
  }

  return (
    <div className="animate-page-enter relative flex min-h-[max(760px,calc(var(--screen-vh)*100))] w-full flex-col overflow-hidden bg-[#0f172a] text-white select-none">
      <img alt="" src={loginBg} className="absolute inset-0 size-full max-w-none object-cover object-top" />

      <div className="relative mt-auto px-[24px] pb-[55px]">
        <div className="flex items-center gap-[12px]">
          <img alt="" src={logo} className="h-[28px] w-[45px]" />
          <span className="text-[17px] leading-[25.5px] font-semibold tracking-[-0.425px]">Tripket PH</span>
        </div>

        <h1 className="mt-[44px] text-[34px] leading-[40px] font-bold tracking-[-1px]">Welcome back</h1>
        <p className="mt-[8px] text-[14px] leading-[22px] tracking-[-0.5px] text-white/90">Keep your tickets and passenger details in one place.</p>

        <div className="mt-[24px] flex flex-col gap-[12px]">
          <button type="button" onClick={() => sso('google', 'juan.delacruz@gmail.com')} className={`${btn} border border-[#e5e5ea] bg-[#f7f7f9] text-[#1c1917]`}>
            <GoogleIcon />
            Continue with Google
            {last?.method === 'google' && <LastUsed />}
          </button>
          <button type="button" onClick={() => sso('apple', 'juan.delacruz@icloud.com')} className={`${btn} bg-[#1c1917] text-white`}>
            <AppleIcon />
            Continue with Apple
            {last?.method === 'apple' && <LastUsed />}
          </button>
          <button type="button" onClick={() => sso('facebook', 'juan.delacruz@yahoo.com')} className={`${btn} bg-[#1877f2] text-white`}>
            <FacebookIcon />
            Continue with Facebook
            {last?.method === 'facebook' && <LastUsed />}
          </button>
        </div>

        <div className="mt-[29px] flex items-center gap-[16px]">
          <span className="h-px flex-1 bg-white/80" />
          <span className="text-[12px] leading-[16px] font-semibold tracking-[1px]">OR CONTINUE WITH</span>
          <span className="h-px flex-1 bg-white/80" />
        </div>

        <button
          type="button"
          onClick={() => {
            if (last?.method === 'email' && !loginDraft.email) loginDraft.email = last.email
            navigate('/login/email', { state: { from } })
          }}
          className={`${btn} mt-[29px] border border-white/60 bg-white/10 text-white backdrop-blur-md`}
        >
          <MailIcon size={20} />
          Sign in with Email
          {last?.method === 'email' && <LastUsed />}
        </button>

        <button type="button" onClick={() => navigate('/')} className="mx-auto mt-[22px] block px-[12px] py-[10px] text-[15px] leading-[20px] font-medium tracking-[-0.2px]">
          Continue as guest
        </button>

        <p className="mx-auto mt-[61px] max-w-[278px] text-center text-[12px] leading-[16px] tracking-[-0.3px] text-white/60">
          By continuing, you agree to our <span className="text-white">Terms of Service</span> and <span className="text-white">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
