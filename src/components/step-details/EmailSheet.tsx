import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import Drawer from '../Drawer'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const WRONG = ['000000']

/** "Confirm your email" sheet (guest → saved passengers): email → code (any 6 digits except 000000) → onVerified. */
export default function EmailSheet({ open, onClose, onVerified }: { open: boolean; onClose: () => void; onVerified: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} label="Confirm your email">
      <Body onClose={onClose} onVerified={onVerified} />
    </Drawer>
  )
}

function Body({ onClose, onVerified }: { onClose: () => void; onVerified: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const valid = EMAIL_RE.test(email.trim())
  const code = digits.join('')

  useEffect(() => {
    if (sent) refs.current[0]?.focus()
  }, [sent])

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
    }
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
    onVerified()
  }

  const cta = 'mt-[16px] h-[56px] w-full rounded-16 bg-[#f97316] text-[16px] leading-[24px] font-bold text-white disabled:opacity-50'
  return (
    <>
      <div className="mx-auto mb-[8px] h-[4px] w-[36px] shrink-0 rounded-[2px] bg-[#e4e4e7]" />
      <div className="relative flex h-[40px] shrink-0 items-center justify-center">
        <button type="button" onClick={onClose} className="absolute left-0 text-[16px] leading-[24px] font-medium text-[#f97316]">
          Cancel
        </button>
        <h2 className="text-[20px] leading-[28px] font-bold text-[#1c1917]">Confirm your email</h2>
      </div>
      <div className="mt-[8px] border-t border-[#f1f5f9] pt-[16px]" />
      {!sent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) setSent(true)
          }}
        >
          <p className="text-[14px] leading-[20px] text-[#1c1917]">Enter your email to autofill your passengers. We&apos;ll send a code to confirm it&apos;s you.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. johndoe@email.com"
            aria-label="Email"
            className="mt-[16px] h-[48px] w-full rounded-12 border border-[#d1d1d6] bg-white px-[12px] text-[16px] text-[#18181b] outline-none placeholder:text-[#a1a1a1] focus:border-[#f97316]"
          />
          <button type="submit" disabled={!valid} className={cta}>
            Send Code
          </button>
        </form>
      ) : (
        <div>
          <p className="text-[14px] leading-[20px] text-[#1c1917]">
            We sent a 6-digit code to <span className="font-medium">{email.trim()}</span>.{' '}
            <button type="button" onClick={() => { setSent(false); set(Array(6).fill('')) }} className="font-semibold text-[#f97316] underline underline-offset-2">
              Edit
            </button>
          </p>
          <div className="mt-[16px] flex justify-between" onPaste={paste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el
                }}
                value={d}
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => change(i, e.target.value)}
                onKeyDown={(e) => keyDown(i, e)}
                onFocus={(e) => e.target.select()}
                className={`h-[56px] w-[48px] rounded-12 border bg-white text-center text-[18px] leading-[24px] font-semibold text-[#1c1917] outline-none focus:border-[#f97316] ${error ? 'border-[#ef4444]' : 'border-[#d1d1d6]'}`}
              />
            ))}
          </div>
          {error && <p className="mt-[12px] text-center text-[13px] leading-[20px] font-medium text-[#ef4444]">The verification code is incorrect. Try again</p>}
          <button type="button" disabled={code.length < 6} onClick={verify} className={cta}>
            Verify and continue
          </button>
        </div>
      )}
    </>
  )
}
