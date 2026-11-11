import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../../auth/AuthContext'
import { loginDraft } from './draft'
import Step from './Step'

const RESEND_SECONDS = 45
// Prototype: any 6-digit code works except these two, which show the "incorrect code" state (482610 is what Figma shows).
const WRONG = ['000000', '482610']

// Figma: 02 – Enter verification code (11598:32315) and 03 – Incorrect code (11598:32336).
export default function VerifyStep() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { signIn } = useAuth()
  const email = loginDraft.email
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState(false)
  const [left, setLeft] = useState(RESEND_SECONDS)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  if (!email) return <Navigate to="/login/email" replace state={state} />

  const code = digits.join('')
  const focus = (i: number) => refs.current[Math.max(0, Math.min(5, i))]?.focus()
  const set = (next: string[]) => {
    setDigits(next)
    setError(false)
  }
  const change = (i: number, v: string) => {
    const d = v.replace(/\D/g, '')
    if (!d) return set(digits.map((x, j) => (j === i ? '' : x)))
    const next = [...digits]
    d.split('').slice(0, 6 - i).forEach((c, k) => (next[i + k] = c))
    set(next)
    focus(i + d.length)
  }
  const keyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i]) {
      e.preventDefault()
      set(digits.map((x, j) => (j === i - 1 ? '' : x)))
      focus(i - 1)
    } else if (e.key === 'ArrowLeft') focus(i - 1)
    else if (e.key === 'ArrowRight') focus(i + 1)
  }
  const paste = (e: ClipboardEvent) => {
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!d) return
    e.preventDefault()
    set(Array.from({ length: 6 }, (_, k) => d[k] ?? ''))
    focus(d.length >= 6 ? 5 : d.length)
  }
  const verify = () => {
    if (WRONG.includes(code)) return setError(true)
    signIn(email) // LoginRoutes redirects a signed-in user back to `from` (or Home)
  }

  return (
    <Step title="Enter verification code" cta="Verify and continue" enabled={code.length === 6} onSubmit={verify}>
      <p className="mt-[6px] text-[14px] leading-[21px] text-text-secondary">We sent a 6-digit code to</p>
      <p className="flex gap-[10px] text-[14px] leading-[21px]">
        <span className="min-w-0 truncate font-medium text-text-primary">{email}</span>
        <button type="button" onClick={() => navigate(-1)} className="shrink-0 font-semibold text-[#f97316] underline underline-offset-2">
          Edit
        </button>
      </p>
      <div className="mt-[38px] flex justify-between" onPaste={paste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            value={d}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            autoFocus={i === 0}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => change(i, e.target.value)}
            onKeyDown={(e) => keyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className="h-[56px] w-[48px] rounded-12 border border-border-default bg-white text-center text-[18px] leading-[24px] font-semibold text-text-primary outline-none focus:border-primary-default"
          />
        ))}
      </div>
      {error && <p className="mt-[14px] text-center text-[13px] leading-[20px] font-medium text-badge-red">The verification code is incorrect. Try again</p>}
      <p className={`${error ? 'mt-[16px]' : 'mt-[21px]'} text-center text-[13px] leading-[20px] text-text-secondary`}>
        Didn't get a code?{' '}
        {left > 0 ? (
          `Resend in ${left}s`
        ) : (
          <button
            type="button"
            onClick={() => {
              setLeft(RESEND_SECONDS)
              set(Array(6).fill(''))
              focus(0)
            }}
            className="font-semibold text-[#f97316] underline underline-offset-2"
          >
            Resend code
          </button>
        )}
      </p>
    </Step>
  )
}
