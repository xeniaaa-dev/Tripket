import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import emailIcon from '../../../assets/figma/settings/email-icon.svg'
import { loginDraft } from './draft'
import Step from './Step'

const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Figma: 01 – Enter Email (11598:32296) and 01b – Valid (11598:32393).
export default function EmailStep() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [email, setEmail] = useState(loginDraft.email)
  const valid = VALID.test(email.trim())
  return (
    <Step
      title="What's your email?"
      cta="Send verification code"
      enabled={valid}
      onSubmit={() => {
        loginDraft.email = email.trim()
        navigate('/login/verify', { state })
      }}
    >
      <p className="mt-[6px] text-[14px] leading-[21px] text-text-secondary">We'll send a one-time code to verify it's you.</p>
      <label htmlFor="login-email" className="mt-[46px] block text-[13px] leading-[19px] font-semibold text-text-primary">
        Email address
      </label>
      <div className={`mt-[7px] flex h-[54px] items-center gap-[12px] rounded-12 border bg-white px-[15px] ${valid ? 'border-primary-default' : 'border-border-default focus-within:border-primary-default'}`}>
        <img alt="" src={emailIcon} className="size-[20px] shrink-0" />
        <input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@email.com"
          className="min-w-0 flex-1 bg-transparent text-[15px] leading-[22px] text-text-primary outline-none placeholder:text-[#8e8e93]"
        />
      </div>
      <p className="mt-[14px] text-[12px] leading-[18px] text-text-secondary">We’ll use this email address for booking updates.</p>
    </Step>
  )
}
